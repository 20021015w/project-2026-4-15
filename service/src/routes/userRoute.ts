import { userController } from "../controllers/user.controller.js";
import { protectedRouter } from "./router.js";

// User CRUD
protectedRouter.get("/users", userController.list);
protectedRouter.get("/users/:id", userController.get);
protectedRouter.post("/users", userController.create);
protectedRouter.put("/users/:id", userController.update);
protectedRouter.delete("/users/:id", userController.remove);
