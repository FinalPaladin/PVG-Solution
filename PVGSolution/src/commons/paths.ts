const BASE_URL = "/PVG-Solution";

export const paths = {
  HOME: `${BASE_URL}`,
  PRODUCTS: `${BASE_URL}/products`,
  PRODUCT_DETAIL: `${BASE_URL}/product/:id`,
  NEWS: `${BASE_URL}/news`,
  NEWS_DETAIL: `${BASE_URL}/news/detail`,
  REQUEST: `${BASE_URL}/request`,
  SUPPORT: `${BASE_URL}/supports`,
};

export const adminPaths = {
  REQUESTS: `${BASE_URL}/admin/requests`,
  REQUEST_DETAIL: `${BASE_URL}/admin/request/:id`,
};
