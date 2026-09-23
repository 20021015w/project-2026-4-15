import express from "express";
import cors from "cors";
import { routes } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { requestLogger } from "./middleware/log.js";

export const app = express();

// ===== 基础插件 =====
// 请求日志注册在最前，保证 body 解析失败 / CORS 出错等异常请求也能被记录
app.use(requestLogger);
app.use(cors());
app.use(express.json());

// ===== 业务路由（统一挂载在 /api 下）=====
app.use("/api", routes);

// ===== 错误拦截插件（最后注册，兜底一切未捕获错误）=====
app.use(notFoundHandler);
app.use(errorHandler);
