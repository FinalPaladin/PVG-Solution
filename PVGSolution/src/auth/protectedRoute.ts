import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";
import { adminPaths } from "@/commons/paths";

export default function ProtectedRoute() {
  const { auth } = useAuth();

  if (!auth.token) {
    return React.createElement(Navigate, {
      to: adminPaths.ADMIN_LOGIN,
      replace: true,
    });
  }

  return React.createElement(Outlet, null);
}
