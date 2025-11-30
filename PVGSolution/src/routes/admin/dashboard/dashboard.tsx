// AdminPages.tsx
// Admin area: Dashboard, Requests list, Request Detail (React + TypeScript + Tailwind)
// Put this file in your project (eg. src/admin/AdminPages.tsx) and wire routes in your router.
// Requires: react-router-dom v6+, Tailwind.

import type { JSX } from "react";

// --- Types ---
export type RequestItem = {
  id: string;
  phone: string;
  data: { key: string; value: string }[]; // matches /api/request_customer/Save payload shape
  createdAt: string;
  fullname?: string; // optional convenience
};

// --- Dashboard ---
export default function AdminDashboard(): JSX.Element {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow-sm">
          Total requests: <span className="font-medium">—</span>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
          Pending: <span className="font-medium">—</span>
        </div>
        <div className="bg-white p-6 rounded shadow-sm">
          Processed: <span className="font-medium">—</span>
        </div>
      </div>
    </div>
  );
}
