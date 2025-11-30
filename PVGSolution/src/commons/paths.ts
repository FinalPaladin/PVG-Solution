const BASE_URL = "/PVG-Solution";
const BASE_ADMIN_URL = `${BASE_URL}/admin`;

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
  ADMIN: `${BASE_ADMIN_URL}`,
  ADMIN_REQUESTS: `${BASE_ADMIN_URL}/requests`,
  ADMIN_REQUEST_DETAIL: `${BASE_ADMIN_URL}/request/:id`,
  ADMIN_LOGIN: `${BASE_ADMIN_URL}/login`,  
  ADMIN_CONFIG: `${BASE_ADMIN_URL}/configuration`,
  ADMIN_CHANGEPASSWORD: `${BASE_ADMIN_URL}/changepassword`,
};
