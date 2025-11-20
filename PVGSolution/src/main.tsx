import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Admin from "./routes/admin/admin.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { adminPaths, paths } from "./commons/paths.ts";

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
const AdminDashboard = React.lazy(() => import("./routes/admin/dashboard.tsx"));
const RequestCustomerAdmin = React.lazy(
  () => import("./routes/admin/request/index.tsx")
);
const RequestCustomerDetail = React.lazy(
  () => import("./routes/admin/request/detail.tsx")
);

const router = createBrowserRouter([
  {
    path: "/PVG-Solution",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: paths.PRODUCTS, element: <ProductsPage /> },
      { path: paths.PRODUCT_DETAIL, element: <ProductDetailPage /> },
      { path: paths.NEWS, element: <NewsPage /> },
      { path: paths.NEWS_DETAIL, element: <NewsDetailPage /> },
      { path: paths.REQUEST, element: <RequestCustomerPage /> },
    ],
  },
  {
    path: "/PVG-Solution/admin",
    element: <Admin />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: adminPaths.REQUESTS, element: <RequestCustomerAdmin /> },
      { path: adminPaths.REQUEST_DETAIL, element: <RequestCustomerDetail /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
