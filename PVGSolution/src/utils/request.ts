import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
});

// ===========================
// REQUEST INTERCEPTOR
// ===========================
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===========================
// RESPONSE INTERCEPTOR
// ===========================
request.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    // Lỗi không có response (lỗi mạng, server chết)
    if (!error.response) {
      alert("Không thể kết nối server. Vui lòng thử lại sau!");
      return Promise.reject(error);
    }

    const msg = error.response.data?.message || error.message;

    // Các lỗi khác
    alert("Lỗi: " + msg);

    return Promise.reject(error);
  }
);

export default request;
