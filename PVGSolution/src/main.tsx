import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Admin from "./routes/admin/admin.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// user site
const HomePage = React.lazy(() => import("./routes/index.tsx"));
const ProductsPage = React.lazy(() => import("./routes/products/products.tsx"));
const ProductDetailPage = React.lazy(
  () => import("./routes/products/productDetail.tsx")
);
const RequestCustomerPage = React.lazy(
  () => import("./routes/requestCustomer/request.tsx")
);

// admin
const RequestCustomerAdmin = React.lazy(
  () => import("./routes/admin/request/index.tsx")
);
const RequestCustomerDetail = React.lazy(
  () => import("./routes/admin/request/detail.tsx")
);

const router = createBrowserRouter([
  {
    path: "/PVG-Solution/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "product/detail", element: <ProductDetailPage /> },
      { path: "request", element: <RequestCustomerPage /> },
    ],
  },
  {
    path: "/PVG-Solution/admin",
    element: <Admin />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "requests", element: <RequestCustomerAdmin /> },
      { path: "requests/detail", element: <RequestCustomerDetail /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
