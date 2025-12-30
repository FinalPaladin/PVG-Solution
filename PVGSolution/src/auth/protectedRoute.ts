import { createElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./authContext";
import { adminPaths } from "@/commons/paths";
import { useMatches } from "react-router-dom";
import type { UIMatch } from "react-router-dom";

type AppRouteHandle = {
  permissions?: string[];
};

const useTypedMatches = () =>
  useMatches() as UIMatch<string, AppRouteHandle>[];

export default function ProtectedRoute() {
  const { auth, initialized } = useAuth();
  const matches = useTypedMatches();
  const location = useLocation();

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
  
  if(location.pathname !== adminPaths.ADMIN)
  {
    const requiredPermissions = matches.flatMap(
      m => m.handle?.permissions ?? []
    );

    if(!requiredPermissions.includes(auth?.permission ? auth?.permission : ""))
    {
      return createElement(Navigate, {
        to: adminPaths.ADMIN,
        replace: true,
      });
    }    
  }

  // Có token → cho vào trang con
  return createElement(Outlet, null);
}
