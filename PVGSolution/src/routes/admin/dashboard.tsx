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

// --- Route snippet (example) ---
// In your router configuration (App.tsx or routes file) add:
//
// import { AdminLayout, AdminDashboard, RequestsList, RequestDetail } from './admin/AdminPages';
//
// <Route path="/admin" element={<AdminLayout />}>
//   <Route index element={<AdminDashboard />} />
//   <Route path="requests" element={<RequestsList />} />
//   <Route path="requests/:id" element={<RequestDetail />} />
// </Route>

// Notes:
// - You must implement backend endpoints or adapt fetch URLs used above:
//   GET /api/request_customer/list  -> returns array of RequestItem
//   GET /api/request_customer/:id   -> returns single RequestItem
//   DELETE /api/request_customer/:id -> deletes the request
// - The components use simple fetch; replace with axios or your utils as desired.
// - Add authentication/guards to admin routes if needed.
