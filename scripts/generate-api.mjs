#!/usr/bin/env node
/**
 * generate-api.mjs —— 从后端 service 的接口契约生成前端 models
 *
 * 输入：service/src/api.contract.ts（zod 定义的接口参数 schema + apiEndpoints 清单）
 * 输出：
 *   src/models/api.schemas.ts —— zod schema（源码原样提取，保留错误消息）
 *   src/models/api.types.ts   —— 由 schema 派生的 TS 类型 + 接口元数据清单
 *
 * 运行：node scripts/generate-api.mjs   （或 pnpm generate:api）
 * 生成的 src/models/ 目录已被 .gitignore / eslint 忽略（如同 node_modules）
 */
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, relative } from 'node:path'
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import ts from 'typescript'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')
const CONTRACT_PATH = join(PROJECT_ROOT, 'service', 'src', 'api.contract.ts')
const MODELS_DIR = join(PROJECT_ROOT, 'src', 'models')
const SCHEMAS_OUT = join(MODELS_DIR, 'api.schemas.ts')
const TYPES_OUT = join(MODELS_DIR, 'api.types.ts')
const CLIENT_OUT = join(MODELS_DIR, 'api.client.ts')
const TMP_FILE = join(__dirname, '.api-contract.tmp.mjs')

const AUTO_GEN_NOTE = '/* eslint-disable */\n// ⚠️ 此文件由 scripts/generate-api.mjs 自动生成，请勿手动修改\n// 修改来源：service/src/api.contract.ts，改完后重新运行 pnpm generate:api\n'

// ---------- 1. 读取契约源码，提取 zod schema 块与 apiEndpoints 引用 ----------
const src = readFileSync(CONTRACT_PATH, 'utf8')
const sf = ts.createSourceFile('api.contract.ts', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

function leftmostIdentifier(node) {
  let cur = node
  while (cur && (ts.isPropertyAccessExpression(cur) || ts.isCallExpression(cur) || ts.isParenthesizedExpression(cur))) {
    cur = cur.expression || cur
  }
  return cur && ts.isIdentifier(cur) ? cur.text : null
}

const schemaNames = []
const schemaSourceBlocks = []
const collected = new Set() // 已收集的 schema 名（用于识别「引用其他 schema」的别名式定义）
const endpointRefs = {} // name -> { body?, query?, response? }（zod schema 标识符名）

for (const stmt of sf.statements) {
  if (!ts.isVariableStatement(stmt)) continue
  for (const decl of stmt.declarationList.declarations) {
    if (!ts.isIdentifier(decl.name) || !decl.initializer) continue

    // 收集 zod schema：export const Xxx = z.xxx(...) 或引用已收集 schema 的别名
    const root = leftmostIdentifier(decl.initializer)
    if (root === 'z' || collected.has(root)) {
      schemaNames.push(decl.name.text)
      schemaSourceBlocks.push(stmt.getText(sf))
      collected.add(decl.name.text)
      continue
    }

    // 解析 apiEndpoints 常量里的 body:/query: 引用（兼容 `as const` 包裹）
    if (decl.name.text === 'apiEndpoints') {
      let init = decl.initializer
      if (ts.isAsExpression(init)) init = init.expression
      if (ts.isArrayLiteralExpression(init)) {
        for (const el of init.elements) {
          if (!ts.isObjectLiteralExpression(el)) continue
          const item = { name: undefined, body: undefined, query: undefined, response: undefined }
          for (const prop of el.properties) {
            if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) continue
            const key = prop.name.text
            const raw = prop.initializer.getText(sf)
            if (key === 'name') {
              item.name = raw.replace(/^['"]|['"]$/g, '')
            } else if (key === 'body' || key === 'query' || key === 'response') {
              item[key] = raw // 标识符名，如 authRegisterBody
            }
          }
          if (item.name) endpointRefs[item.name] = item
        }
      }
    }
  }
}
if (schemaNames.length === 0) {
  console.error(`[generate-api] 未在 ${CONTRACT_PATH} 中找到任何 zod schema（export const xxx = z.xxx）`)
  process.exit(1)
}

// ---------- 2. 执行契约，拿到 apiEndpoints 实际数据（校验一致性） ----------
const js = ts.transpileModule(src, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
}).outputText
writeFileSync(TMP_FILE, js, 'utf8')

let endpoints
try {
  const url = `${pathToFileURL(TMP_FILE).href}?t=${Date.now()}`
  const mod = await import(url)
  endpoints = mod.apiEndpoints
} catch (err) {
  console.error('[generate-api] 执行契约文件失败:', err.message)
  try {
    const tmp = readFileSync(TMP_FILE, 'utf8')
    console.error('      临时文件长度:', tmp.length, '| 开头:', JSON.stringify(tmp.slice(0, 60)))
  } catch { /* 文件已被清理 */ }
  console.error('      临时文件:', TMP_FILE)
  process.exit(1)
} finally {
  rmSync(TMP_FILE, { force: true })
}
if (!Array.isArray(endpoints) || endpoints.length === 0) {
  console.error('[generate-api] 契约中的 apiEndpoints 为空或格式不正确')
  process.exit(1)
}

// ---------- 3. 生成 src/models/api.schemas.ts ----------
const schemasBody = schemaSourceBlocks
  .map((block) => block.replace(/^export /, '')) // 去掉 export，统一由文件底部导出
  .join('\n\n')
const schemasExport = `export {\n${schemaNames.map((n) => `  ${n},`).join('\n')}\n}\n`

const schemasFile =
  AUTO_GEN_NOTE +
  `import { z } from 'zod'\n\n` +
  schemasBody +
  '\n\n' +
  schemasExport
// ---------- 4. 生成 src/models/api.types.ts ----------
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const typeAliases = schemaNames.map((n) => `export type ${capitalize(n)} = z.infer<typeof Schemas.${n}>`).join('\n')

const endpointLines = endpoints.map((ep) => {
  const ref = endpointRefs[ep.name] ?? {}
  const fields = [
    `name: ${JSON.stringify(ep.name)}`,
    `method: ${JSON.stringify(ep.method)}`,
    `path: ${JSON.stringify(ep.path)}`,
    `auth: ${String(ep.auth)}`,
    `summary: ${JSON.stringify(ep.summary ?? '')}`,
  ]
  if (ref.body) fields.push(`body: '${ref.body}'`)
  if (ref.query) fields.push(`query: '${ref.query}'`)
  if (ref.response) fields.push(`response: '${ref.response}'`)
  return `  { ${fields.join(', ')} }`
})

const typesFile =
  AUTO_GEN_NOTE +
  `import type { z } from 'zod'\n` +
  `import * as Schemas from './api.schemas'\n\n` +
  typeAliases +
  '\n\n' +
  `export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'\n\n` +
  `export interface ApiEndpointMeta {\n` +
  `  name: string\n` +
  `  method: ApiMethod\n` +
  `  path: string\n` +
  `  auth: boolean\n` +
  `  summary: string\n` +
  `  body?: keyof typeof Schemas\n` +
  `  query?: keyof typeof Schemas\n` +
  `  response?: keyof typeof Schemas\n` +
  `}\n\n` +
  `/** 接口清单（与后端 service/src/api.contract.ts 的 apiEndpoints 保持一致） */\n` +
  `export const apiEndpoints: ApiEndpointMeta[] = [\n` +
  endpointLines.join(',\n') +
  `\n]\n`

// ---------- 5. 生成 src/models/api.client.ts（可直接调用的请求方法） ----------
const typeNameOf = (schemaName) => capitalize(schemaName) // authRegisterBody -> AuthRegisterBody
const methodNameOf = (endpointName) => {
  const parts = endpointName.split(/[/.]/).filter(Boolean)
  return parts[0] + parts.slice(1).map(capitalize).join('')
}

const clientMethods = endpoints.map((ep) => {
  const ref = endpointRefs[ep.name] ?? {}
  const fnName = methodNameOf(ep.name)
  const pathParams = (ep.path.match(/:[a-zA-Z]+/g) || []).map((p) => p.slice(1))
  const urlExpr = pathParams.length
    ? '`' + ep.path.replace(/:[a-zA-Z]+/g, (m) => '${' + m.slice(1) + '}') + '`'
    : JSON.stringify(ep.path)

  const args = []
  for (const p of pathParams) args.push(`${p}: number`)
  if (ref.body) args.push(`body: ${typeNameOf(ref.body)}`)
  if (ref.query) args.push(`query?: ${typeNameOf(ref.query)}`)

  const defaultType = ref.response ? typeNameOf(ref.response) : 'unknown'

  // 统一走 packages/utils 封装的 Http（@utils/method）：GET/POST 用快捷方法，其余走 Http.request
  // 注意：Http.get/post 的泛型为 <T 响应, D 参数>，两个类型参数都必须显式传入
  let call
  if (ep.method === 'GET') {
    const paramsType = ref.query ? typeNameOf(ref.query) : 'undefined'
    const paramsArg = ref.query ? 'query' : 'undefined'
    call = `return Http.get<ApiResponse<D>, ${paramsType}>(${urlExpr}, ${paramsArg}, baseConfig()).then((r) => r.data);`
  } else if (ep.method === 'POST') {
    const bodyType = ref.body ? typeNameOf(ref.body) : 'undefined'
    const bodyArg = ref.body ? 'body' : 'undefined'
    call = `return Http.post<ApiResponse<D>, ${bodyType}>(${urlExpr}, ${bodyArg}, baseConfig()).then((r) => r.data);`
  } else {
    const dataLine = ref.body ? `\n    data: body,` : ''
    call =
      `return Http.request<ApiResponse<D>>({\n` +
      `    method: ${JSON.stringify(ep.method)},\n` +
      `    url: ${urlExpr},${dataLine}\n` +
      `    ...baseConfig(),\n` +
      `  }).then((r) => r.data);`
  }

  return (
    `/** ${ep.summary ?? ''}${ep.auth ? '（需登录）' : ''} */\n` +
    `export function ${fnName}<D = ${defaultType}>(${args.join(', ')}): Promise<ApiResponse<D>> {\n` +
    `  ${call}\n` +
    `}\n`
  )
})

const clientTypesImport =
  `import type {\n${schemaNames.map((n) => `  ${typeNameOf(n)},`).join('\n')}\n} from "./api.types";\n`

const clientFile =
  AUTO_GEN_NOTE +
  `import { Http } from "@utils/method";\n\n` +
  clientTypesImport +
  `\n` +
  `/**\n` +
  ` * 所有请求统一走 packages/utils 封装的 Http（@utils/method）。\n` +
  ` * 注意：不要调用 Http.initHttp —— 它的响应拦截器会把响应解包成 data 字段，\n` +
  ` * 而这里需要完整保留后端统一响应结构 { code, message, data }。\n` +
  ` */\n\n` +
  `/** 后端统一响应结构 */\n` +
  `export interface ApiResponse<T = unknown> {\n  code: number;\n  message: string;\n  data: T;\n}\n\n` +
  `/** 后端地址（默认为空，走 webpack devServer 代理 /api -> :3000） */\n` +
  `let baseUrl = "";\n\n` +
  `/** 设置后端地址 */\n` +
  `export function setApiBaseUrl(url: string) {\n  baseUrl = url;\n}\n\n` +
  `/** 默认从 localStorage 读取 token（非浏览器环境返回 null），可通过 setTokenProvider 覆盖 */\n` +
  `let tokenProvider: () => string | null = () =>\n  typeof localStorage !== "undefined" ? (localStorage.getItem("token") ?? null) : null;\n\n` +
  `export function setTokenProvider(fn: () => string | null) {\n  tokenProvider = fn;\n}\n\n` +
  `/** 每个请求的公共配置：后端地址 + 超时 + 登录态 token，随请求传给 Http */\n` +
  `function baseConfig() {\n` +
  `  const token = tokenProvider();\n` +
  `  return {\n` +
  `    baseURL: baseUrl,\n` +
  `    timeout: 15000,\n` +
  `    headers: token ? { Authorization: \`Bearer \${token}\` } : undefined,\n` +
  `  };\n` +
  `}\n\n` +
  `// ==================== 接口方法（自动生成） ====================\n\n` +
  clientMethods.join('\n')

// ---------- 6. 写出文件 ----------
mkdirSync(MODELS_DIR, { recursive: true })
writeFileSync(SCHEMAS_OUT, schemasFile, 'utf8')
writeFileSync(TYPES_OUT, typesFile, 'utf8')
writeFileSync(CLIENT_OUT, clientFile, 'utf8')

console.log(`[generate-api] ✅ 生成完成`)
console.log(`  schema 数      : ${schemaNames.length}`)
console.log(`  接口数         : ${endpoints.length}`)
console.log(`  生成文件       :`)
console.log(`    ${relative(PROJECT_ROOT, SCHEMAS_OUT)}`)
console.log(`    ${relative(PROJECT_ROOT, TYPES_OUT)}`)
console.log(`    ${relative(PROJECT_ROOT, CLIENT_OUT)}`)
console.log(`  [提示] src/models/ 已加入 .gitignore 与 eslint ignores，由脚本生成、勿手改`)
