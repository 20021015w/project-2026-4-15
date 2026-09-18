import type { Request } from "express";

// JWT 载荷
export interface JwtPayload {
  userId: number;
  email: string;
}

// 携带登录用户的请求
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// 统一响应体
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
}
