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

export const addService = async (serviceData) => {
    try {
        const response = await axios.post(`${API_URL}/Services`, serviceData);
        if (response.status === 201 || response.data.success === true) {
            return {
                success: true,
                service: response.data.data,
              };
        }
        else {
             return {
            success: false,
            message: "Có lỗi xảy ra khi thêm dịch vụ.",
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

export const updateService = async (serviceId, serviceData) => {
    try {
        const response = await axios.put(`${API_URL}/Services/${serviceId}`, serviceData);
        if (response.status === 200 || response.data.success === true) {
            return {
                success: true,
                service: response.data.data,
              };
        }   
        else {
             return {
            success: false,
            message: "Có lỗi xảy ra khi cập nhật dịch vụ.",
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

export const deleteService = async (serviceId) => {
    try {
        const response = await axios.delete(`${API_URL}/Services/${serviceId}`);
        if (response.status === 200 || response.data.success === true) {
            return {
                success: true,
                message: response.data.message || "Dịch vụ đã được xóa thành công.",
                };
        }
        else {
             return {
            success: false,
            message: response.data.message || "Có lỗi xảy ra khi xóa dịch vụ.",
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