import { createElement } from "react";
import { Navigate, Outlet,  } from "react-router-dom";//useLocation
import { useAuth } from "./authContext";
import { adminPaths } from "@/commons/paths";
// import { useGetPath } from "@/commons/permission";

export default function ProtectedRoute() {
  const { auth, initialized } = useAuth();
  // const dataPath = useGetPath();
  // const location = useLocation();

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
  
  // if(!dataPath.find(x => x.path == location.pathname))
  // {
  //   return createElement(Navigate, {
  //     to: adminPaths.ADMIN,
  //     replace: true,
  //   });
  // }

  // Có token → cho vào trang con
  return createElement(Outlet, null);
}
