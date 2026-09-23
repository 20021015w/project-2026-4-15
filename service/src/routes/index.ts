import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { authController } from "../controllers/auth.controller.js";
import { listController } from "../controllers/list.controller.js";
import { userController } from "../controllers/user.controller.js";
import { postController } from "../controllers/post.controller.js";
const router = Router();

// ===== 公开路由 =====
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/refresh", authController.refresh);
// ===== 受保护路由组：插件化注入认证中间件 =====
const protectedRouter = Router();
protectedRouter.use(auth);

// List CRUD
protectedRouter.get("/lists", listController.list);
protectedRouter.get("/lists/:id", listController.get);
protectedRouter.post("/lists", listController.create);
protectedRouter.put("/lists/:id", listController.update);
protectedRouter.delete("/lists/:id", listController.remove);

// User CRUD
protectedRouter.get("/users", userController.list);
protectedRouter.get("/users/:id", userController.get);
protectedRouter.post("/users", userController.create);
protectedRouter.put("/users/:id", userController.update);
protectedRouter.delete("/users/:id", userController.remove);

// Post CRUD
protectedRouter.get("/posts", postController.list);
protectedRouter.get("/posts/:id", postController.get);
protectedRouter.post("/posts", postController.create);
protectedRouter.put("/posts/:id", postController.update);
protectedRouter.delete("/posts/:id", postController.remove);

router.use(protectedRouter);

export const routes = router;
