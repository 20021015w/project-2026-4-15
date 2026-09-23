import type { NextFunction, Request, Response } from "express";

// 请求日志插件：记录每次请求的方法、路径、状态码与耗时
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const line = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

    // 按状态码分级输出：5xx → error，4xx → warn，其余 → log
    if (res.statusCode >= 500) console.error(line);
    else if (res.statusCode >= 400) console.warn(line);
    else console.log(line);
  });

  next();
}
