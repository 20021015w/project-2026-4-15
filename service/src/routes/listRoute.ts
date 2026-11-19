import { listController } from "../controllers/list.controller.js";
import { protectedRouter } from "./router.js";

// List CRUD
protectedRouter.get("/lists", listController.list);
protectedRouter.get("/lists/:id", listController.get);
protectedRouter.post("/lists", listController.create);
protectedRouter.put("/lists/:id", listController.update);
protectedRouter.delete("/lists/:id", listController.remove);
