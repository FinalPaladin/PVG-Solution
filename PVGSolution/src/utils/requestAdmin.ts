import { useErrorStore } from "@/stores/useErrorStore";
import axios from "axios";

const requestAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
});

// ===========================
// REQUEST INTERCEPTOR
// ===========================
requestAdmin.interceptors.request.use(
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
requestAdmin.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    if (!error.response) {
      useErrorStore
        .getState()
        .showError("Không thể kết nối server. Vui lòng thử lại sau!");
      return Promise.reject(error);
    }

    const msg =
      error.response?.data?.error?.errorMessage ||
      error.message ||
      "Hệ thống xảy ra lỗi";
    useErrorStore.getState().showError(msg);
    return Promise.reject(error);
  }
);

export default requestAdmin;
