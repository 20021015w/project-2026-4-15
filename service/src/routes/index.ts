import { authController } from "../controllers/auth.controller.js";
import { protectedRouter, router } from "./router.js";

// ===== 公开路由 =====
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/refresh", authController.refresh);

// ===== 受保护路由：各模块向 protectedRouter 自行注册 =====
import "./listRoute.js";
import "./userRoute.js";
import "./post.js";

// 最后挂载受保护路由组，保证公开路由先匹配
router.use(protectedRouter);

export const routes = router;
export default protectedRouter;
