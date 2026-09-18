// API 接口自测脚本（临时验证用）
// 运行: pnpm exec tsx test-api.ts
const BASE = "http://localhost:3000/api";

async function call(method: string, path: string, body?: unknown, token?: string) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    /* ignore */
  }
  return { status: res.status, json };
}

async function main() {
  let pass = 0,
    fail = 0;
  function check(name: string, actual: number, expect: number) {
    const ok = actual === expect;
    ok ? pass++ : fail++;
    console.log(`${ok ? "✅" : "❌"} [${name}] 期望 ${expect} 实际 ${actual}`);
  }

  // 1. 登录
  const login = await call("POST", "/auth/login", {
    email: "test@example.com",
    password: "123456",
  });
  check("登录", login.status, 200);
  const token = (login.json as any)?.data?.token;
  console.log("   token 前缀:", token?.slice(0, 20) + "...");

  // 1.5 注册
  const newEmail = `reg_${Date.now()}@example.com`;
  const reg = await call("POST", "/auth/register", {
    email: newEmail,
    password: "abc123",
    name: "新用户",
  });
  check("注册新用户", reg.status, 201);
  check("注册即返回 token", typeof (reg.json as any)?.data?.token === "string" ? 200 : 0, 200);
  check(
    "重复邮箱注册（409）",
    (await call("POST", "/auth/register", { email: newEmail, password: "abc123" })).status,
    409,
  );
  check(
    "密码过短注册（400）",
    (await call("POST", "/auth/register", { email: `x_${Date.now()}@e.com`, password: "123" }))
      .status,
    400,
  );
  check(
    "注册后可登录",
    (await call("POST", "/auth/login", { email: newEmail, password: "abc123" })).status,
    200,
  );

  // 2. 认证拦截
  check("无 token 访问", (await call("GET", "/lists")).status, 401);
  check("无效 token", (await call("GET", "/lists", undefined, "bad.token")).status, 401);

  // 3. List CRUD
  const created = await call(
    "POST",
    "/lists",
    { title: "第一个任务", content: "学习分层架构", status: "PENDING" },
    token,
  );
  check("创建 List", created.status, 201);
  const listId = (created.json as any)?.data?.id;
  console.log("   新 List id =", listId);

  check("List 列表", (await call("GET", "/lists", undefined, token)).status, 200);
  check("List 详情", (await call("GET", `/lists/${listId}`, undefined, token)).status, 200);
  check(
    "List 状态过滤",
    (await call("GET", "/lists?status=PENDING", undefined, token)).status,
    200,
  );

  const updated = await call(
    "PUT",
    `/lists/${listId}`,
    { status: "DONE", title: "第一个任务(已完成)" },
    token,
  );
  check("更新 List", updated.status, 200);
  console.log("   更新后 status =", (updated.json as any)?.data?.status);

  // 4. 错误拦截
  check(
    "缺 title 创建（400）",
    (await call("POST", "/lists", { content: "x" }, token)).status,
    400,
  );
  check("不存在的 id（404）", (await call("GET", "/lists/99999", undefined, token)).status, 404);
  check("不存在的路由（404）", (await call("GET", "/nope", undefined, token)).status, 404);

  // 5. User CRUD（唯一冲突 409）
  const dupUser = await call("POST", "/users", { email: "test@example.com", password: "x" }, token);
  check("重复 email 创建用户（409）", dupUser.status, 409);
  check("User 列表", (await call("GET", "/users", undefined, token)).status, 200);

  // 6. Post CRUD
  const post = await call("POST", "/posts", { title: "第一篇", content: "hi", authorId: 4 }, token);
  check("创建 Post", post.status, 201);
  const postId = (post.json as any)?.data?.id;
  check(
    "Post 详情（含作者）",
    (await call("GET", `/posts/${postId}`, undefined, token)).status,
    200,
  );

  // 7. 删除
  check("删除 List", (await call("DELETE", `/lists/${listId}`, undefined, token)).status, 200);
  check("删除后详情（404）", (await call("GET", `/lists/${listId}`, undefined, token)).status, 404);

  console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("测试异常:", e);
  process.exit(1);
});
