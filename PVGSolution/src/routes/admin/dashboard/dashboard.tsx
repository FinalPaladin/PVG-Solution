// AdminPages.tsx
// Admin area: Dashboard, Requests list, Request Detail (React + TypeScript + Tailwind)
// Put this file in your project (eg. src/admin/AdminPages.tsx) and wire routes in your router.
// Requires: react-router-dom v6+, Tailwind.

import { initDashboard } from "@/api/admin/adDashboard";
import { useAuth } from "@/auth/authContext";
import type { IRS_DashboardInitPageModel } from "@/models/admin/dashboard.model";
import { useEffect, useState, type JSX } from "react";

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
  const { auth } = useAuth();
  const [data, setData] = useState<IRS_DashboardInitPageModel>({
    requestThisMonth: 0,
    requestThisMonthProcessed: 0,
    requestThisWeek: 0,
    requestThisWeekProcessed: 0,
    requestYesterday: 0,
    requestYesterdayProcessed: 0,
    viewHome: 0,
    viewNews: 0,
    viewProducts: 0
  } as IRS_DashboardInitPageModel);

  useEffect(() => {
    const loadform = async () => {
      const res = await initDashboard();
      if(res && res.isSuccess)
      {
        if(res.result)
          setData(res?.result);       
      }
    }

    loadform();
  }, [])

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Xin chào, <span className="text-green-700">{auth.userName}</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Chúc bạn một ngày làm việc hiệu quả
        </p>
      </div>

      {/* Tổng quan */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
        <h4 className="text-sm font-medium text-gray-600 mb-4">
          Tất cả yêu cầu đăng ký
        </h4>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="text-sm text-gray-700">
            Đã xử lý: <span className="font-semibold text-green-700">0</span>
          </div>
          <div className="text-sm text-gray-700">
            Chưa xử lý: <span className="font-semibold text-orange-600">0</span>
          </div>
        </div>
      </div>

      {/* Thống kê theo thời gian */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Hôm qua */}
        <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-white p-5">
          <h5 className="mb-2 text-sm font-medium text-gray-600">
            Hôm qua
          </h5>
          <p className="text-sm text-gray-700">
            Tất cả: <span className="font-semibold text-gray-600">{data.requestYesterday}</span>
          </p>
          <p className="text-sm text-gray-700">
            Đã xử lý: <span className="font-semibold text-green-700">{data.requestYesterdayProcessed}</span>
          </p>
          <p className="text-sm text-gray-700">
            Chưa xử lý: <span className="font-semibold text-orange-600">{data.requestThisMonth - data.requestYesterdayProcessed}</span>
          </p>
        </div>

        {/* Tuần này */}
        <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-5">
          <h5 className="mb-2 text-sm font-medium text-gray-600">
            Tuần này
          </h5>
          <p className="text-sm text-gray-700">
            Tất cả: <span className="font-semibold text-gray-600">{data.requestThisWeek}</span>
          </p>
          <p className="text-sm text-gray-700">
            Đã xử lý: <span className="font-semibold text-green-700">{data.requestThisWeekProcessed}</span>
          </p>
          <p className="text-sm text-gray-700">
            Chưa xử lý: <span className="font-semibold text-orange-600">{data.requestThisMonth - data.requestThisWeekProcessed}</span>
          </p>
        </div>

        {/* Tháng này */}
        <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-5">
          <h5 className="mb-2 text-sm font-medium text-gray-600">
            Tháng này
          </h5>
          <p className="text-sm text-gray-700">
            Tất cả: <span className="font-semibold text-gray-600">{data.requestThisMonth}</span>
          </p>
          <p className="text-sm text-gray-700">
            Đã xử lý: <span className="font-semibold text-green-700">{data.requestThisMonthProcessed}</span>
          </p>
          <p className="text-sm text-gray-700">
            Chưa xử lý: <span className="font-semibold text-orange-600">{data.requestThisMonth - data.requestThisMonthProcessed}</span>
          </p>
        </div>
      </div>
    
      {/* Tổng quan */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
        <h4 className="text-sm font-medium text-gray-600 mb-4">
          Tất cả các lượt truy cấp
        </h4>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="text-sm text-gray-700">
            Trang chủ: <span className="font-semibold text-green-700">{data.viewHome}</span>
          </div>
          <div className="text-sm text-gray-700">
            Sản phẩm: <span className="font-semibold text-green-700">{data.viewProducts}</span>
          </div>
          <div className="text-sm text-gray-700">
            Tin tức: <span className="font-semibold text-green-700">{data.viewNews}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
