import { type JSX, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Menu,
  ChevronLeft,
  User2,
  LogOut,
  Info,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useAuth } from "../../auth/authContext";

export default function AdminLayout(): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { auth, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleToggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      logout();
    }
  };

  const handleShowVersion = () => {
    const version = import.meta.env.VITE_APP_VERSION ?? "1.0.0";
    alert(`Version: ${version}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`relative h-screen border-r border-gray-200 bg-white flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Top: logo + toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold text-lg">
                A
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  Admin Panel
                </span>
                <span className="text-xs text-gray-500">PVG Solution</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleToggleSidebar}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            {collapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            to="/admin"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive("/admin")
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            {!collapsed && <span>Dashboard</span>}
          </Link>

          <Link
            to="/admin/requests"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive("/admin/requests")
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ClipboardList className="h-5 w-5" />
            {!collapsed && <span>Quản lý Yêu cầu khách</span>}
          </Link>
        </nav>

        {/* User box bottom-left + Popover */}
        <div className="border-t border-gray-100 px-3 py-3">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                  <User2 className="h-5 w-5 text-emerald-600" />
                </div>
                {!collapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {auth.fullName || auth.userName || "User"}
                    </span>
                    <span className="text-xs text-gray-500">Quản trị viên</span>
                  </div>
                )}
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="start"
              className="w-60 p-0 rounded-xl border border-gray-200 shadow-xl"
            >
              {" "}
              <button
                type="button"
                onClick={handleShowVersion}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Info className="h-4 w-4" />
                <span>Xem Version</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
