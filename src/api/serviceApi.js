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

export const getServiceOrder = async (searchParams = {}) => {
    try {
        console.log('📤 Calling getServiceOrder API with params:', searchParams);
        const response = await axios.get(`${API_URL}/service-orders/rooms`, { params: searchParams });
        console.log('📥 getServiceOrder API response:', response);
        
        if (response.status === 200) {
            // API trả về trực tiếp mảng, không có wrapper
            const orders = Array.isArray(response.data) ? response.data : (response.data.data || []);
            return {
                success: true,
                orders: orders,
              };
        }
        else {
             return {
            success: false,
            message: "Có lỗi xảy ra khi lấy danh sách đơn dịch vụ.",
          };
        }
    } 
    catch (error) {
        console.error('❌ getServiceOrder API error:', error.response?.data || error.message);
        return {
            success: false, 
            message: error.response?.data?.message || error.message || "Không thể kết nối tới máy chủ.",
        };
    }
}

export const getServicesByReservationDetail = async (reservationDetailId) => {
    try {
        console.log('📤 Calling getServicesByReservationDetail API for:', reservationDetailId);
        const response = await axios.get(`${API_URL}/service-orders/rooms/${reservationDetailId}`);
        console.log('📥 getServicesByReservationDetail API response:', response.data);
        
        if (response.status === 200) {
            // API trả về trực tiếp mảng hoặc có wrapper
            const services = Array.isArray(response.data) ? response.data : (response.data.data || []);
            return {
                success: true,
                services: services,
              };
        }
        else {
             return {
            success: false,
            message: "Có lỗi xảy ra khi lấy danh sách dịch vụ của đơn đặt phòng.",
          };
        } 
    } 
    catch (error) {
        console.error('❌ getServicesByReservationDetail API error:', error.response?.data || error.message);
        return {
            success: false, 
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
}

export const addServiceOrder = async (reservationDetailId, serviceId, quantity) => {
    try {
        console.log('📤 Calling addServiceOrder API:', { reservationDetailId, serviceId, quantity });
        const response = await axios.post(`${API_URL}/service-orders`, {
            reservationDetailId,
            serviceId,
            quantity
        });
        console.log('📥 addServiceOrder API response:', response.data);
        
        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                data: response.data,
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
        console.error('❌ addServiceOrder API error:', error.response?.data || error.message);
        return {
            success: false, 
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
}

export const deleteServiceOrder = async (serviceOrderId) => {
    try {
        console.log('📤 Calling deleteServiceOrder API for:', serviceOrderId);
        const response = await axios.delete(`${API_URL}/service-orders/${serviceOrderId}`);
        console.log('📥 deleteServiceOrder API response:', response.data);
        
        if (response.status === 200) {
            return {
                success: true,
                message: response.data.message || "Xóa dịch vụ thành công.",
            };
        }
        else {
            return {
                success: false,
                message: "Có lỗi xảy ra khi xóa dịch vụ.",
            };
        }
    } 
    catch (error) {
        console.error('❌ deleteServiceOrder API error:', error.response?.data || error.message);
        return {
            success: false, 
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
}