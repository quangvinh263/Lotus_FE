import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/Employee/allEmployees`);
    if (response.status === 200 || response.data.success === true) {
      return {
        success: true,
        employees: response.data.data,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
    };
  }
};