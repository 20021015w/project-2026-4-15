import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.js";

export interface PostCreateInput {
  title: string;
  content?: string;
  published?: boolean;
  authorId: number;
}

export interface PostUpdateInput {
  title?: string;
  content?: string;
  published?: boolean;
  authorId?: number;
}

const authorSelect = { id: true, email: true, name: true } as const;

export const postService = {
  async list() {
    return prisma.post.findMany({
      include: { author: { select: authorSelect } },
      orderBy: { createdAt: "desc" },
    });
  },

  async get(id: number) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: authorSelect } },
    });
    if (!post) throw new AppError(404, 404, `Post #${id} 不存在`);
    return post;
  },

  async create(input: PostCreateInput) {
    return prisma.post.create({ data: input, include: { author: { select: authorSelect } } });
  },

  async update(id: number, input: PostUpdateInput) {
    await this.get(id);
    return prisma.post.update({
      where: { id },
      data: input,
      include: { author: { select: authorSelect } },
    });
  },

  async remove(id: number) {
    await this.get(id);
    return prisma.post.delete({ where: { id } });
  },
};
