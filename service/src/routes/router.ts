import { Router } from "express";
import { auth } from "../middleware/auth.js";

// 路由实例单独放在这里，供各路由模块导入，
// 避免 listRoute/userRoute/post 直接导入 index.js 造成循环依赖。
export const router = Router();
export const protectedRouter = Router();
protectedRouter.use(auth);
