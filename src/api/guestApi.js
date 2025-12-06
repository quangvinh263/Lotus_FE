import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getAllGuests = async () => {
  try {
    const response = await axios.get(`${API_URL}/Guests/guest`);
    if (response.status === 200 || response.data.success === true) {
        return {
            success: true,
            guests: response.data.data,
          };
    }
    else
         return {
        success: false,
        message: "Có lỗi xảy ra khi lấy danh sách khách.",
      };
    } 
    catch (error) {
    return {
        success: false, 
        message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
}

export const getGuestById = async (guestId) => {
  try {
    const response = await axios.get(`${API_URL}/Guests/${guestId}`);
    if (response.status === 200 || response.data.success === true) {
        return {
            success: true,
            guest: response.data,
          };
    } else {
         return {
        success: false,
        message: "Có lỗi xảy ra khi lấy thông tin khách hàng.",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
    };
  }
} 