import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getAllServices = async () => {
    try {
        const response = await axios.get(`${API_URL}/Services`);
        if (response.status === 200 || response.data.success === true) {
            return {
                success: true,
                services: response.data.data,
              };
        }
        else {
             return {
            success: false,
            message: "Có lỗi xảy ra khi lấy danh sách dịch vụ.",
          };
        }
    } 
    catch (error) {
        return {
            success: false, 
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
};

export const getRevenueByMonth = async (month, year) => {
    try {
        const response = await axios.get(`${API_URL}/Services/revenues`, {
            params: { month, year }
        });
        if (response.status === 200 || response.data.success === true) {
            return {
                success: true,
                revenue: response.data.totalRevenue,
                };
        }
        else {
             return {
            success: false,
            message: "Có lỗi xảy ra khi lấy doanh thu dịch vụ.",
          };
        }   
    } 
    catch (error) {
        return {
            success: false, 
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
};