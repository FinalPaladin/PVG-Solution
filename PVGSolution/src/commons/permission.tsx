import type { IPageModel } from "@/models/admin/page.model";
import { adminPaths } from "./paths";
import { hashpermission } from "./const";
import { useAuth } from "@/auth/authContext";
import {
  ChartBarStacked,
  ClipboardList,
  Cog,
  LayoutDashboard,
  Newspaper,
  SquareAsterisk,
  SquareChartGantt,
} from "lucide-react";

const permissionPages = [
  {
    path: adminPaths.ADMIN,
    pathIcon: <LayoutDashboard className="h-5 w-5" />,
    pathName: "Dashboard",
    permissions: [
      hashpermission.admin_system,
      hashpermission.admin_sales,
      hashpermission.admin_mkt,
    ],
    isMenu: true,
  },
  {
    path: adminPaths.ADMIN_REQUESTS,
    pathIcon: <ClipboardList className="h-5 w-5" />,
    pathName: "Quản lý Yêu cầu khách",
    permissions: [hashpermission.admin_system, hashpermission.admin_sales],
    isMenu: true,
  },
  {
    path: adminPaths.ADMIN_CONFIG,
    pathIcon: <Cog className="h-5 w-5" />,
    pathName: "Cài đặt",
    permissions: [hashpermission.admin_system],
    isMenu: true,
  },
  {
    path: adminPaths.ADMIN_CHANGEPASSWORD,
    pathIcon: <SquareAsterisk className="h-5 w-5" />,
    pathName: "Đổi mật khẩu",
    permissions: [
      hashpermission.admin_system,
      hashpermission.admin_sales,
      hashpermission.admin_mkt,
    ],
    isMenu: true,
  },
  {
    path: adminPaths.ADMIN_PRODUCTCATEGORY,
    pathIcon: <ChartBarStacked className="h-5 w-5" />,
    pathName: "Danh mục sản phẩm",
    permissions: [hashpermission.admin_system],
    isMenu: true,
  },
  {
    path: adminPaths.ADMIN_PRODUCT,
    pathIcon: <SquareChartGantt className="h-5 w-5" />,
    pathName: "Sản phẩm",
    permissions: [hashpermission.admin_system],
    isMenu: true,
  },
  {
    path: adminPaths.ADMIN_PRODUCT_NEW,
    pathIcon: null,
    pathName: "Tạo sản phẩm",
    permissions: [hashpermission.admin_system],
    isMenu: false,
  },
  {
    path: adminPaths.ADMIN_PRODUCT_DETAIL,
    pathIcon: null,
    pathName: "Sản phẩm chi tiết",
    permissions: [hashpermission.admin_system],
    isMenu: false,
  },
  {
    path: adminPaths.ADMIN_NEWS_CATEGORY,
    pathIcon: <Newspaper className="h-5 w-5" />,
    pathName: "Danh mục tin tức",
    permissions: [hashpermission.admin_system, hashpermission.admin_mkt],
    isMenu: true,
  },
  {
    path: adminPaths.ADMIN_NEWS,
    pathIcon: <Newspaper className="h-5 w-5" />,
    pathName: "Tin tức",
    permissions: [hashpermission.admin_system, hashpermission.admin_mkt],
    isMenu: true,
  },
  {
    path: adminPaths.ADMIN_NEWS_CREATE,
    pathIcon: null,
    pathName: "Tạo tin tức",
    permissions: [hashpermission.admin_system, hashpermission.admin_mkt],
    isMenu: false,
  },
  {
    path: adminPaths.ADMIN_NEWS_UPDATE,
    pathIcon: null,
    pathName: "Cập nhật tin tức",
    permissions: [hashpermission.admin_system, hashpermission.admin_mkt],
    isMenu: false,
  },
] as IPageModel[];

export const useGetMenu = () => {
  const { auth } = useAuth();
  const data = permissionPages.filter(
    (x) =>
      x.permissions.includes(auth?.permission ? auth?.permission : "") &&
      x.isMenu
  );
  return data;
};
