import { postController } from "../controllers/post.controller.js";
import { protectedRouter } from "./router.js";

// Post CRUD
protectedRouter.get("/posts", postController.list);
protectedRouter.get("/posts/:id", postController.get);
protectedRouter.post("/posts", postController.create);
protectedRouter.put("/posts/:id", postController.update);
protectedRouter.delete("/posts/:id", postController.remove);
