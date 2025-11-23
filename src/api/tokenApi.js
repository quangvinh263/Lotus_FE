import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    const newToken = response.data.token;
    if (newToken) {
      localStorage.setItem("token", newToken);
      return { success: true, token: newToken };
    }
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // ✅ Refresh token đã hết hạn → logout user
      localStorage.clear();
      window.location.href = "/signin";
    }
    return { success: false, message: "Làm mới token thất bại." };
  }
};
