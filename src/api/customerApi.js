import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const createPersonalInfo = async (accountId, data) => {
  try {
    const response = await axios.post(`${API_URL}/customer/create-profile/${accountId}`, data);
    if (response.status === 200 || response.data.success === true) {
      return {
        success: true,
        message:
          response.data.message ||
          "Thông tin cá nhân đã được lưu thành công.",
      };
    }
    return {
      success: false,
      message: response.data.message || "Có lỗi xảy ra khi đăng ký.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
    };
  }
};