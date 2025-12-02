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

export const createEmployee = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/Employee/createEmployee`, data);
    if (response.status === 200 || response.data.success === true) {
      return {
        success: true,
        message: response.data.message || "Nhân viên đã được tạo thành công.",
      };
    }   
    if (response.status == 400 && !response.data.success) {
        return {
            success: false,
            message: response.data.message || "Có lỗi xảy ra khi tạo nhân viên.",
          };
    }
} catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
    };
  }
};

export const updateEmployee = async (employeeId, data) => {
  try {
    const response = await axios.put(`${API_URL}/Employee/${employeeId}`, data);
    if (response.status === 200 || response.data.success === true) {
        return {
            success: true,
            message: response.data.message || "Nhân viên đã được cập nhật thành công.",
          };
    }
    if (!response.data.success) {
        return {
            success: false,
            message: response.data.message || "Có lỗi xảy ra khi cập nhật nhân viên.",
          };
    }
    } catch (error) {
    return {
        success: false, 
        message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
    };
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_URL}/Employee/${employeeId}`);    
    if (response.status === 200 || response.data.success === true) {
      return {
        success: true,
        message: response.data.message || "Nhân viên đã được xóa thành công.",
        };
    }
        if (response.status == 404 && !response.data.success) {
        return {
            success: false,
            message: response.data.message || "Nhân viên không tồn tại.",
          };
    }
    } catch (error) {
    return {
        success: false, 
        message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
    };
  }
};
