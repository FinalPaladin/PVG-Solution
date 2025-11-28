import { createElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";
import { adminPaths } from "@/commons/paths";

export default function ProtectedRoute() {
  const { auth, initialized } = useAuth();

  // Chưa load xong localStorage/cookie → tạm thời chưa quyết định
  if (!initialized) {
    // Có thể return spinner nếu muốn
    return null;
  }

  // Đã init xong mà vẫn không có token → đá về login
  if (!auth.token) {
    return createElement(Navigate, {
      to: adminPaths.ADMIN_LOGIN,
      replace: true,
    });
  }

  // Có token → cho vào trang con
  return createElement(Outlet, null);
}
