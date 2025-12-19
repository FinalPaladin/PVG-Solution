const BASE_URL = "";
const BASE_ADMIN_URL = `${BASE_URL}/admin`;

export const paths = {
  HOME: `${BASE_URL}`,
  PRODUCTS: `${BASE_URL}/san-pham`,
  PRODUCT_DETAIL: `${BASE_URL}/san-pham/:id`,
  NEWS: `${BASE_URL}/tin-tuc`,
  NEWS_DETAIL: `${BASE_URL}/tin-tuc/:category/:slug`,
  REQUEST: `${BASE_URL}/gui-yeu-cau/:idproduct`,
  SUPPORT: `${BASE_URL}/ho-tro`,
  INITWEB: `${BASE_URL}/initweb`,
  SUCCESS: `${BASE_URL}/thanh-cong`,
};

export const adminPaths = {
  ADMIN: `${BASE_ADMIN_URL}`,
  ADMIN_REQUESTS: `${BASE_ADMIN_URL}/requests`,
  ADMIN_REQUEST_DETAIL: `${BASE_ADMIN_URL}/request/:id`,
  ADMIN_LOGIN: `${BASE_ADMIN_URL}/login`,
  ADMIN_CONFIG: `${BASE_ADMIN_URL}/configuration`,
  ADMIN_CHANGEPASSWORD: `${BASE_ADMIN_URL}/changepassword`,
  ADMIN_PRODUCT: `${BASE_ADMIN_URL}/products`,
  ADMIN_PRODUCT_DETAIL: `${BASE_ADMIN_URL}/products/:id`,
  ADMIN_PRODUCT_NEW: `${BASE_ADMIN_URL}/products/create`,
  ADMIN_PRODUCTCATEGORY: `${BASE_ADMIN_URL}/product-category`,
  ADMIN_NEWS: `${BASE_ADMIN_URL}/news`,
  ADMIN_NEWS_UPDATE: `${BASE_ADMIN_URL}/news/:id`,
  ADMIN_NEWS_CREATE: `${BASE_ADMIN_URL}/news/create`,
  ADMIN_NEWS_CATEGORY: `${BASE_ADMIN_URL}/news-category`,
};
