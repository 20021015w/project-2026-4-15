import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { AppError } from "../middleware/error.js";
import { postService } from "../services/post.service.js";

export const postController = {
  // GET /api/posts
  async list(req: AuthRequest, res: Response) {
    const items = await postService.list();
    res.json({ code: 0, message: "ok", data: items });
  },

  // GET /api/posts/:id
  async get(req: AuthRequest, res: Response) {
    const item = await postService.get(Number(req.params.id));
    res.json({ code: 0, message: "ok", data: item });
  },

  // POST /api/posts  { title, content?, published?, authorId }
  async create(req: AuthRequest, res: Response) {
    const { title, content, published, authorId } = req.body ?? {};
    if (!title || typeof title !== "string") {
      throw new AppError(400, 400, "title 为必填字符串");
    }
    if (!authorId || typeof authorId !== "number") {
      throw new AppError(400, 400, "authorId 为必填数字");
    }
    const item = await postService.create({ title, content, published, authorId });
    res.status(201).json({ code: 0, message: "创建成功", data: item });
  },

  // PUT /api/posts/:id  { title?, content?, published?, authorId? }
  async update(req: AuthRequest, res: Response) {
    const { title, content, published, authorId } = req.body ?? {};
    const item = await postService.update(Number(req.params.id), {
      title,
      content,
      published,
      authorId,
    });
    res.json({ code: 0, message: "更新成功", data: item });
  },

  // DELETE /api/posts/:id
  async remove(req: AuthRequest, res: Response) {
    await postService.remove(Number(req.params.id));
    res.json({ code: 0, message: "删除成功", data: null });
  },
};
