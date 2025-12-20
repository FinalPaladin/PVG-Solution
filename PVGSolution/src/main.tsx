import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Admin from "./routes/admin/admin.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { adminPaths, paths } from "./commons/paths.ts";
import { AuthProvider } from "./auth/authContext.ts";
import ProtectedRoute from "./auth/protectedRoute.ts";
import { GlobalErrorAlert } from "./components/common/errorDialog.tsx";
import { WebConfigProvider } from "./auth/webConfigContext.ts";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { hashpermission } from "./commons/const.ts";

// user site
const HomePage = React.lazy(() => import("./routes/index.tsx"));
const ProductsPage = React.lazy(() => import("./routes/products/products.tsx"));
const ProductDetailPage = React.lazy(
  () => import("./routes/products/productDetail.tsx")
);
const RequestCustomerPage = React.lazy(
  () => import("./routes/requestCustomer/request.tsx")
);
const NewsPage = React.lazy(() => import("./routes/news/news.tsx"));
const NewsDetailPage = React.lazy(() => import("./routes/news/detail.tsx"));

// admin
const AdminDashboard = React.lazy(
  () => import("./routes/admin/dashboard/dashboard.tsx")
);
const RequestCustomerAdmin = React.lazy(
  () => import("./routes/admin/request/index.tsx")
);
const RequestCustomerDetail = React.lazy(
  () => import("./routes/admin/request/detail.tsx")
);
const AdminLogin = React.lazy(() => import("./routes/admin/login/index.tsx"));

const AdminConfiguration = React.lazy(
  () => import("./routes/admin/configuration/index.tsx")
);
const AdminChangePassword = React.lazy(
  () => import("./routes/admin/changePassword/index.tsx")
);

const AdminProduct = React.lazy(
  () => import("./routes/admin/product/index.tsx")
);
const AdminProductDetail = React.lazy(
  () => import("./routes/admin/product/detail.tsx")
);
const AdminProductCategory = React.lazy(
  () => import("./routes/admin/productCategory/index.tsx")
);

const AdminNews = React.lazy(() => import("./routes/admin/news/index.tsx"));
const AdminNewsCreateOrUpdate = React.lazy(
  () => import("./routes/admin/news/detail.tsx")
);
const AdminNewsCategory = React.lazy(
  () => import("./routes/admin/newsCategory/index.tsx")
);

const InitWebPage = React.lazy(() => import("./routes/initWeb/index.tsx"));
const SuccessPage = React.lazy(() => import("./routes/successPage"));

const router = createBrowserRouter([
  {
    path: paths.HOME,
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: paths.PRODUCTS, element: <ProductsPage /> },
      { path: paths.PRODUCT_DETAIL, element: <ProductDetailPage /> },
      { path: paths.NEWS, element: <NewsPage /> },
      { path: paths.NEWS_DETAIL, element: <NewsDetailPage /> },
      { path: paths.REQUEST, element: <RequestCustomerPage /> },
      { path: paths.INITWEB, element: <InitWebPage /> },
      { path: paths.SUCCESS, element: <SuccessPage /> },
    ],
  },
  {
    path: adminPaths.ADMIN_LOGIN,
    element: <AdminLogin />,
  },
  {
    path: adminPaths.ADMIN,
    element: <ProtectedRoute />, // ⬅️ bảo vệ route admin
    children: [
      {
        path: "",
        element: <Admin />, // layout admin
        children: [
          { 
            index: true, element: <AdminDashboard />,
            handle: {permissions: [hashpermission.admin_system, hashpermission.admin_mkt, hashpermission.admin_sales]}
          },
          {
            path: adminPaths.ADMIN_REQUESTS,
            element: <RequestCustomerAdmin />,
            handle: {permissions: [hashpermission.admin_system, hashpermission.admin_sales]}
          },
          {
            path: adminPaths.ADMIN_REQUEST_DETAIL,
            element: <RequestCustomerDetail />,
            handle: {permissions: [hashpermission.admin_system, hashpermission.admin_sales]}
          },
          {
            path: adminPaths.ADMIN_CONFIG,
            element: <AdminConfiguration />,
            handle: {permissions: [hashpermission.admin_system]}
          },
          {
            path: adminPaths.ADMIN_CHANGEPASSWORD,
            element: <AdminChangePassword />,
            handle: {permissions: [hashpermission.admin_system, hashpermission.admin_mkt, hashpermission.admin_sales]}
          },
          {
            path: adminPaths.ADMIN_PRODUCT,
            element: <AdminProduct />,
            handle: {permissions: [hashpermission.admin_system]}
          },
          {
            path: adminPaths.ADMIN_PRODUCT_NEW,
            element: <AdminProductDetail />,
            handle: {permissions: [hashpermission.admin_system]}
          },
          {
            path: adminPaths.ADMIN_PRODUCT_DETAIL,
            element: <AdminProductDetail />,
            handle: {permissions: [hashpermission.admin_system]}
          },
          {
            path: adminPaths.ADMIN_PRODUCTCATEGORY,
            element: <AdminProductCategory />,
            handle: {permissions: [hashpermission.admin_system]}
          },
          {
            path: adminPaths.ADMIN_NEWS,
            element: <AdminNews />,
            handle: {permissions: [hashpermission.admin_system, hashpermission.admin_mkt]}
          },
          {
            path: adminPaths.ADMIN_NEWS_UPDATE,
            element: <AdminNewsCreateOrUpdate />,
            handle: {permissions: [hashpermission.admin_system, hashpermission.admin_mkt]}
          },
          {
            path: adminPaths.ADMIN_NEWS_CREATE,
            element: <AdminNewsCreateOrUpdate />,
            handle: {permissions: [hashpermission.admin_system, hashpermission.admin_mkt]}
          },
          {
            path: adminPaths.ADMIN_NEWS_CATEGORY,
            element: <AdminNewsCategory />,
            handle: {permissions: [hashpermission.admin_system, hashpermission.admin_mkt]}
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHAV3_KEY}
    >
      <WebConfigProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <GlobalErrorAlert />
        </AuthProvider>
      </WebConfigProvider>
    </GoogleReCaptchaProvider>
  </StrictMode>
);
