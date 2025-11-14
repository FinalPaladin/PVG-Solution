import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Admin from "./routes/admin/admin.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// user site
const HomePage = React.lazy(() => import("./routes/index.tsx"));
const ProductsPage = React.lazy(() => import("./routes/products.tsx"));
const RequestCustomerPage = React.lazy(() => import("./routes/request.tsx"));

// admin
const RequestCustomerAdmin = React.lazy(
  () => import("./routes/admin/request/index.tsx")
);
const RequestCustomerDetail = React.lazy(
  () => import("./routes/admin/request/detail.tsx")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "request", element: <RequestCustomerPage /> },
    ],
  },
  {
    path: "/admin",
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
