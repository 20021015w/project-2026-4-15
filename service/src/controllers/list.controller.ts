import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { AppError } from "../middleware/error.js";
import { listService } from "../services/list.service.js";
import type { ListStatus } from "../../generated/prisma/enums.js";

export const listController = {
  // GET /api/lists?status=PENDING
  async list(req: AuthRequest, res: Response) {
    const status = req.query.status as ListStatus | undefined;
    const items = await listService.list(status);
    res.json({ code: 0, message: "ok", data: items });
  },

  // GET /api/lists/:id
  async get(req: AuthRequest, res: Response) {
    const item = await listService.get(Number(req.params.id));
    res.json({ code: 0, message: "ok", data: item });
  },

  // POST /api/lists  { title, content?, status? }
  async create(req: AuthRequest, res: Response) {
    const { title, content, status } = req.body ?? {};
    if (!title || typeof title !== "string") {
      throw new AppError(400, 400, "title 为必填字符串");
    }
    const item = await listService.create({ title, content, status });
    res.status(201).json({ code: 0, message: "创建成功", data: item });
  },

  // PUT /api/lists/:id  { title?, content?, status? }
  async update(req: AuthRequest, res: Response) {
    const { title, content, status } = req.body ?? {};
    const item = await listService.update(Number(req.params.id), { title, content, status });
    res.json({ code: 0, message: "更新成功", data: item });
  },

  // DELETE /api/lists/:id
  async remove(req: AuthRequest, res: Response) {
    await listService.remove(Number(req.params.id));
    res.json({ code: 0, message: "删除成功", data: null });
  },
};
