import type { NextFunction, Request, Response } from "express";
import type { ApiResponse } from "../types/index.js";

// 业务异常：status = HTTP 状态码，code = 业务码
export class AppError extends Error {
  constructor(
    public status: number,
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// 404：未匹配到任何路由
export function notFoundHandler(req: Request, res: Response<ApiResponse<null>>) {
  res.status(404).json({ code: 404, message: `接口不存在: ${req.method} ${req.path}`, data: null });
}

// 全局错误拦截插件：AppError / Prisma 错误 / 未知错误 → 统一响应体
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response<ApiResponse<null>>,
  _next: NextFunction,
) {
  // 业务异常
  if (err instanceof AppError) {
    res.status(err.status).json({ code: err.code, message: err.message, data: null });
    return;
  }

  // Prisma 已知错误映射
  const e = err as { code?: string; message?: string };
  if (e?.code === "P2002") {
    res.status(409).json({ code: 409, message: "数据已存在（唯一约束冲突）", data: null });
    return;
  }
  if (e?.code === "P2025") {
    res.status(404).json({ code: 404, message: "记录不存在", data: null });
    return;
  }

  // 未知错误（开发期输出日志便于排查；生产环境可隐藏 message）
  console.error("[UnhandledError]", err);
  res.status(500).json({ code: 500, message: e?.message ?? "服务器内部错误", data: null });
}
