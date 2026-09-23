// =====================================================================
// 接口契约（API Contract）— 前后端接口参数的唯一事实来源
// 前端通过 scripts/generate-api.mjs 读取本文件，生成 src/models/ 下的
// 接口与类型文件（zod schema + 派生 TS 类型 + 可直接调用的请求方法）。
// 注意：本文件只允许依赖 zod，生成脚本依赖此约束做源码提取。
// =====================================================================
import { z } from "zod";

// ============ 通用响应模型（与 service 层返回结构一致） ============
export const userBrief = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string().nullable(),
});

export const userItem = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const listItem = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().nullable(),
  status: z.enum(["PENDING", "DONE", "ARCHIVED"]),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const postItem = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
  authorId: z.number(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  author: userBrief,
});

// 删除类接口统一返回 null
export const emptyResponse = z.null();

// ============ auth ============
export const authRegisterBody = z.object({
  email: z.email("邮箱格式不正确"),
  password: z.string().min(6, "password 长度不能少于 6 位"),
  name: z.string().optional(),
});

export const authLoginBody = z.object({
  email: z.email("邮箱格式不正确"),
  password: z.string().min(1, "password 为必填项"),
});
export const authRefreshBody = z.object({
  refreshToken: z.string(),
});
export const authRefreshResponse = z.object({
  refreshToken: z.string(),
  token:z.string()
});
export const authRegisterResponse = z.object({
  token: z.string(),
  refreshToken: z.string(),
  user: userItem,
});

export const authLoginResponse = z.object({
  token: z.string(),
  refreshToken: z.string(),
  user: userBrief,
});

// ============ list ============
export const listStatusEnum = z.enum(["PENDING", "DONE", "ARCHIVED"]);

export const listQuery = z.object({
  status: listStatusEnum.optional(),
});

export const listCreateBody = z.object({
  title: z.string().min(1, "title 为必填字符串"),
  content: z.string().optional(),
  status: listStatusEnum.optional(),
});

export const listUpdateBody = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  status: listStatusEnum.optional(),
});

export const listListResponse = z.array(listItem);
export const listItemResponse = listItem;

// ============ user ============
export const userCreateBody = z.object({
  email: z.email("邮箱格式不正确"),
  password: z.string().min(1, "password 为必填项"),
  name: z.string().optional(),
});

export const userUpdateBody = z.object({
  email: z.email("邮箱格式不正确").optional(),
  password: z.string().min(1).optional(),
  name: z.string().optional(),
});

export const userListResponse = z.array(userItem);
export const userItemResponse = userItem;

// ============ post ============
export const postCreateBody = z.object({
  title: z.string().min(1, "title 为必填字符串"),
  content: z.string().optional(),
  published: z.boolean().optional(),
  authorId: z.number().int().positive("authorId 为必填数字"),
});

export const postUpdateBody = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
  authorId: z.number().int().positive().optional(),
});

export const postListResponse = z.array(postItem);
export const postItemResponse = postItem;

// ============ 接口清单 ============
export const apiEndpoints = [
  {
    name: "auth/register",
    method: "POST",
    path: "/api/auth/register",
    auth: false,
    summary: "注册（注册即登录，返回 token）",
    body: authRegisterBody,
    response: authRegisterResponse,
  },
  {
    name: "auth/login",
    method: "POST",
    path: "/api/auth/login",
    auth: false,
    summary: "登录，返回 token 与用户信息",
    body: authLoginBody,
    response: authLoginResponse,
  },
  {
    name: "auth/refresh",
    method: "POST",
    path: "/api/auth/refresh",
    auth: false,
    summary: "刷新token",
    body: authRefreshBody,
    response: authRefreshResponse,
  },
  {
    name: "lists.list",
    method: "GET",
    path: "/api/lists",
    auth: true,
    summary: "List 列表（可按状态过滤）",
    query: listQuery,
    response: listListResponse,
  },
  {
    name: "lists.get",
    method: "GET",
    path: "/api/lists/:id",
    auth: true,
    summary: "List 详情",
    response: listItemResponse,
  },
  {
    name: "lists.create",
    method: "POST",
    path: "/api/lists",
    auth: true,
    summary: "创建 List",
    body: listCreateBody,
    response: listItemResponse,
  },
  {
    name: "lists.update",
    method: "PUT",
    path: "/api/lists/:id",
    auth: true,
    summary: "更新 List",
    body: listUpdateBody,
    response: listItemResponse,
  },
  {
    name: "lists.remove",
    method: "DELETE",
    path: "/api/lists/:id",
    auth: true,
    summary: "删除 List",
    response: emptyResponse,
  },
  {
    name: "users.list",
    method: "GET",
    path: "/api/users",
    auth: true,
    summary: "User 列表",
    response: userListResponse,
  },
  {
    name: "users.get",
    method: "GET",
    path: "/api/users/:id",
    auth: true,
    summary: "User 详情",
    response: userItemResponse,
  },
  {
    name: "users.create",
    method: "POST",
    path: "/api/users",
    auth: true,
    summary: "创建 User",
    body: userCreateBody,
    response: userItemResponse,
  },
  {
    name: "users.update",
    method: "PUT",
    path: "/api/users/:id",
    auth: true,
    summary: "更新 User",
    body: userUpdateBody,
    response: userItemResponse,
  },
  {
    name: "users.remove",
    method: "DELETE",
    path: "/api/users/:id",
    auth: true,
    summary: "删除 User",
    response: emptyResponse,
  },
  {
    name: "posts.list",
    method: "GET",
    path: "/api/posts",
    auth: true,
    summary: "Post 列表",
    response: postListResponse,
  },
  {
    name: "posts.get",
    method: "GET",
    path: "/api/posts/:id",
    auth: true,
    summary: "Post 详情",
    response: postItemResponse,
  },
  {
    name: "posts.create",
    method: "POST",
    path: "/api/posts",
    auth: true,
    summary: "创建 Post",
    body: postCreateBody,
    response: postItemResponse,
  },
  {
    name: "posts.update",
    method: "PUT",
    path: "/api/posts/:id",
    auth: true,
    summary: "更新 Post",
    body: postUpdateBody,
    response: postItemResponse,
  },
  {
    name: "posts.remove",
    method: "DELETE",
    path: "/api/posts/:id",
    auth: true,
    summary: "删除 Post",
    response: emptyResponse,
  },
] as const;
