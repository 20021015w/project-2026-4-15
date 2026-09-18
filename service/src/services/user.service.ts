import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.js";

export interface UserCreateInput {
  email: string;
  password: string;
  name?: string;
}

// 对外不暴露 password 字段
const userSelect = { id: true, email: true, name: true, createdAt: true, updatedAt: true } as const;

export const userService = {
  async list() {
    return prisma.user.findMany({ select: userSelect, orderBy: { createdAt: "desc" } });
  },

  async get(id: number) {
    const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!user) throw new AppError(404, 404, `User #${id} 不存在`);
    return user;
  },

  async create(input: UserCreateInput) {
    return prisma.user.create({ data: input, select: userSelect });
  },

  async update(id: number, input: Partial<UserCreateInput>) {
    await this.get(id);
    return prisma.user.update({ where: { id }, data: input, select: userSelect });
  },

  async remove(id: number) {
    await this.get(id);
    return prisma.user.delete({ where: { id } });
  },
};
