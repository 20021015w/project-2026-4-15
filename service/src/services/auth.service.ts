import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.js";

export const authService = {
  // 注册（注册即登录：直接签发 token）
  async register(email: string, password: string, name?: string) {
    try {
      const user = await prisma.user.create({
        data: { email, password, name },
        select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
      });
      const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      });
      return { token, user };
    } catch (e) {
      const err = e as { code?: string };
      if (err.code === "P2002") {
        throw new AppError(409, 409, "该邮箱已被注册");
      }
      throw e;
    }
  },

  // 登录
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    // 演示环境为明文比对；生产环境请改用 bcrypt 等哈希方案
    if (!user || user.password !== password) {
      throw new AppError(401, 401, "邮箱或密码错误");
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      `${config.jwtSecret} refresh`,
      {
        expiresIn: config.jwtRefreshExpiresIn,
      },
    );
    return {
      token,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  },
};
