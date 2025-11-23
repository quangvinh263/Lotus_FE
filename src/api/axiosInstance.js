import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "./tokenApi";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Tạo instance riêng cho API
const api = axios.create({
  baseURL: API_URL,
});

// 🧠 Hàm kiểm tra token hết hạn
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

// 🛠️ Interceptor: luôn gắn token vào header, và tự refresh nếu hết hạn
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // Nếu token hết hạn → gọi refresh
  if (isTokenExpired(token) && refreshToken) {
  try {
      const result = await refreshAccessToken(refreshToken);
      if (result?.success && result.token) {
        token = result.token;
      } else {
        // Nếu refresh token không hợp lệ → logout luôn
        localStorage.clear();
        window.location.href = "/signin";
      }
    } catch (error) {
      localStorage.clear();
      window.location.href = "/signin";
    }
}

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.clear();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
