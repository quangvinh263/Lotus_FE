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

export const getPersonalInfo = async (accountId) => {
  try {
    const response = await axios.get(`${API_URL}/customer/get-profile/${accountId}`);
    if (response.status === 200 || response.data.success === true) {
      return {
        success: true,
        data: response.data.customer,
      }
    }
    return {
      success: false,
      message: response.data.message || "Có lỗi xảy ra khi lấy thông tin cá nhân.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
    };
  }
};

export const updatePersonalInfo = async (accountId, data) => {
  try {
    const response = await axios.put(`${API_URL}/customer/update-profile/${accountId}`, data);
    if (response.status === 200 || response.data.success === true) {
      return {
        success: true,
        message:
          response.data.message ||
          "Thông tin cá nhân đã được cập nhật thành công.",
      };
    }
    return {
      success: false,
      message: response.data.message || "Có lỗi xảy ra khi cập nhật thông tin cá nhân.",
    };
  }
  catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
    };
  }
};

// Tạo customer mới (cho Reception tạo đơn walk-in)
export const createCustomer = async (customerData) => {
  try {
    const requestData = {
      fullName: customerData.fullName,
      phone: customerData.phone,
      address: customerData.address || '',
      gender: customerData.gender,
      dateOfBirth: customerData.dateOfBirth ? 
        new Date(customerData.dateOfBirth).toISOString().split('T')[0] : null
    };

    console.log('Creating walk-in customer:', requestData);

    const response = await axios.post(`${API_URL}/Customer/create-walkin`, requestData);
    
    console.log('Create Walk-in Customer Response:', response.data);
    
    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        customerId: response.data.customerId,
        data: response.data
      };
    }
    
    return {
      success: false,
      message: "Response không hợp lệ",
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.title || "Không thể tạo khách hàng.",
    };
  }
};

// Tìm customer theo SĐT
export const findCustomerByPhone = async (phoneNumber) => {
  try {
    const response = await axios.get(`${API_URL}/Customer/search-by-phone`, {
      params: { phone: phoneNumber }
    });
    
    console.log('Search Customer Response:', response.data);
    
    if (response.status === 200 && response.data && response.data.customer) {
      return {
        success: true,
        customerId: response.data.customer.customerId,
        data: response.data.customer
      };
    }
    
    return {
      success: false,
      message: "Không tìm thấy khách hàng",
    };
  } catch (error) {
    console.error('Error searching customer:', error);
    // 404 = không tìm thấy, return success: false để tạo mới
    if (error.response?.status === 404) {
      return {
        success: false,
        message: "Không tìm thấy khách hàng",
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi tìm kiếm khách hàng.",
    };
  }
};

// Xóa customer (dùng để rollback khi tạo booking thất bại)
export const deleteCustomer = async (customerId) => {
  try {
    console.log('Deleting customer:', customerId);
    const response = await axios.delete(`${API_URL}/Customer/${customerId}`);
    
    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        message: "Đã xóa khách hàng thành công"
      };
    }
    
    return {
      success: false,
      message: "Response không hợp lệ",
    };
  } catch (error) {
    console.error('Error deleting customer:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.title || "Không thể xóa khách hàng.",
    };
  }
};