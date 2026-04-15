import { App as AntApp } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

// 仅在开发环境引入mock服务
if (process.env.NODE_ENV === "development") {
  import("./mock");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <AntApp>
      <App />
    </AntApp>
  </React.StrictMode>,
);
