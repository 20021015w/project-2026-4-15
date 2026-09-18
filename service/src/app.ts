import express from "express";
import cors from "cors";
import { routes } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

export const app = express();

// ===== 基础插件 =====
app.use(cors());
app.use(express.json());

// ===== 业务路由（统一挂载在 /api 下）=====
app.use("/api", routes);

// ===== 错误拦截插件（最后注册，兜底一切未捕获错误）=====
app.use(notFoundHandler);
app.use(errorHandler);
