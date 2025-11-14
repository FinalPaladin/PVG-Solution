import { type JSX } from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 h-screen p-6">
          <h2 className="text-xl font-semibold mb-6">Admin</h2>
          <nav className="flex flex-col gap-2">
            <Link to="/admin" className="px-3 py-2 rounded hover:bg-gray-100">
              Dashboard
            </Link>
            <Link
              to="/admin/requests"
              className="px-3 py-2 rounded hover:bg-gray-100"
            >
              Quản lý Yêu cầu khách
            </Link>
          </nav>
        </aside>

        {/* Main area */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
