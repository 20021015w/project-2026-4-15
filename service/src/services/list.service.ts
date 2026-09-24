import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.js";
import type { ListStatus } from "../../generated/prisma/enums.js";
import { ListFindManyArgs } from "../../generated/prisma/models.js";

export interface ListCreateInput {
  title: string;
  content?: string;
  status?: ListStatus;
}

export interface ListUpdateInput {
  title?: string;
  content?: string;
  status?: ListStatus;
}

export const listService = {
  async list(userId: number, status?: ListStatus) {
    return prisma.list.findMany({
      where: { user_id: userId, status },
      orderBy: { createdAt: "desc" },
    });
  },

  async get(id: number) {
    const item = await prisma.list.findUnique({ where: { id } });
    if (!item) throw new AppError(404, 404, `List #${id} 不存在`);
    return item;
  },

  async create(input: ListCreateInput) {
    return prisma.list.create({ data: input });
  },

  async update(id: number, input: ListUpdateInput) {
    await this.get(id);
    return prisma.list.update({ where: { id }, data: input });
  },

  async remove(id: number) {
    await this.get(id);
    return prisma.list.delete({ where: { id } });
  },
};
