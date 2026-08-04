# syntax=docker/dockerfile:1.6

# =============================================================================
# 阶段 1: deps - 安装全量依赖（含 workspace）
# =============================================================================
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@8.9.0 --activate
WORKDIR /app

# 先仅拷贝依赖描述文件，利用 docker 层缓存
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ui/package.json      packages/ui/
COPY packages/utils/package.json   packages/utils/
COPY packages/maxgraph/package.json packages/maxgraph/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# =============================================================================
# 阶段 2: build - 构建主应用 + dumi 文档
# =============================================================================
FROM node:20-alpine AS build
RUN corepack enable && corepack prepare pnpm@8.9.0 --activate
WORKDIR /app

# 拷贝已安装的 node_modules 与源码
COPY --from=deps /app ./
COPY . .

# 构建主应用（产物 /app/dist）
RUN pnpm build

# 构建 dumi 文档站（产物 /app/packages/ui/docs-dist）
RUN pnpm --filter @ui/components build:doc

# =============================================================================
# 阶段 3: app-runtime - 主应用 nginx
# =============================================================================
FROM nginx:alpine AS app-runtime
COPY docker/nginx.app.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000

# =============================================================================
# 阶段 4: docs-runtime - dumi 文档 nginx
# =============================================================================
FROM nginx:alpine AS docs-runtime
COPY docker/nginx.docs.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/ui/docs-dist /usr/share/nginx/html
EXPOSE 80
