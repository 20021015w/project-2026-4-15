import type { Request, Response } from "express";
import { AppError } from "../middleware/error.js";
import { authService } from "../services/auth.service.js";

export const authController = {
  // POST /api/auth/register  { email, password, name? }
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body ?? {};
    if (!email || !password) {
      throw new AppError(400, 400, "email 与 password 为必填项");
    }
    if (typeof password !== "string" || password.length < 6) {
      throw new AppError(400, 400, "password 长度不能少于 6 位");
    }
    const data = await authService.register(
      String(email),
      String(password),
      name ? String(name) : undefined,
    );
    res.status(201).json({ code: 0, message: "注册成功", data });
  },

  // POST /api/auth/login  { email, password }
  async login(req: Request, res: Response) {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      throw new AppError(400, 400, "email 与 password 为必填项");
    }
    const data = await authService.login(String(email), String(password));
    res.json({ code: 0, message: "ok", data });
  },
};
