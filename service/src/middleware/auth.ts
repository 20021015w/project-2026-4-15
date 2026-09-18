import jwt from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import { config } from "../config.js";
import type { AuthRequest, JwtPayload } from "../types/index.js";
import { AppError } from "./error.js";

// 认证插件：校验 Authorization: Bearer <token>，通过后挂载 req.user
export function auth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, 401, "未登录：请求头需携带 Authorization: Bearer <token>");
  }
  try {
    req.user = jwt.verify(header.slice(7), config.jwtSecret) as JwtPayload;
    next();
  } catch {
    throw new AppError(401, 401, "登录已失效，请重新登录");
  }
}
