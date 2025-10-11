import { createBrowserRouter, Navigate } from "react-router-dom";

// * 创建路由表
export const router = [
  {
    path: "/",
    element: <Navigate to="/" />, // 重定向
  }
];

export default createBrowserRouter(router, { basename: "/" });
