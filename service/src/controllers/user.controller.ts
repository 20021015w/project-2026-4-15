import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { AppError } from "../middleware/error.js";
import { userService } from "../services/user.service.js";

export const userController = {
  // GET /api/users
  async list(req: AuthRequest, res: Response) {
    const items = await userService.list();
    res.json({ code: 0, message: "ok", data: items });
  },

  // GET /api/users/:id
  async get(req: AuthRequest, res: Response) {
    const item = await userService.get(Number(req.params.id));
    res.json({ code: 0, message: "ok", data: item });
  },

  // POST /api/users  { email, password, name? }
  async create(req: AuthRequest, res: Response) {
    const { email, password, name } = req.body ?? {};
    if (!email || !password) {
      throw new AppError(400, 400, "email 与 password 为必填项");
    }
    const item = await userService.create({
      email: String(email),
      password: String(password),
      name,
    });
    res.status(201).json({ code: 0, message: "创建成功", data: item });
  },

  // PUT /api/users/:id  { email?, password?, name? }
  async update(req: AuthRequest, res: Response) {
    const { email, password, name } = req.body ?? {};
    const item = await userService.update(Number(req.params.id), { email, password, name });
    res.json({ code: 0, message: "更新成功", data: item });
  },

  // DELETE /api/users/:id
  async remove(req: AuthRequest, res: Response) {
    await userService.remove(Number(req.params.id));
    res.json({ code: 0, message: "删除成功", data: null });
  },
};
