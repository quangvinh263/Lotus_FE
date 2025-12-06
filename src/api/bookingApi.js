import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const getBookingsStatistic = async () => {   
    try {
        const response = await axios.get(`${API_URL}/Reservations/statistics`);
        
        console.log('Booking Statistics Response:', response.data);
        
        if (response.status === 200 && response.data) {
            return {
                success: true,
                data: response.data
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        console.error('Error fetching booking statistics:', error);
        return {
            success: false,
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
}

export const getBookingsList = async (statusFilter = null, keyword = null) => {
    try {
        const params = {};
        if (statusFilter && statusFilter !== 'all') {
            params.statusFilter = statusFilter;
        }
        if (keyword && keyword.trim()) {
            params.keyword = keyword.trim();
        }

        const response = await axios.get(`${API_URL}/Reservations/list`, { params });
        
        console.log('Bookings List Response:', response.data);
        
        if (response.status === 200 && response.data) {
            return {
                success: true,
                data: response.data
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        console.error('Error fetching bookings list:', error);
        return {
            success: false,
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
}

export const getBookingDetail = async (reservationId) => {
    try {
        const response = await axios.get(`${API_URL}/Reservations/${reservationId}`);
        
        console.log('Booking Detail Response:', response.data);
        
        if (response.status === 200 && response.data) {
            return {
                success: true,
                data: response.data
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        console.error('Error fetching booking detail:', error);
        return {
            success: false,
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
}


// Check-in booking
export const checkInBooking = async (checkInData) => {
  try {
    console.log('📤 Sending check-in request:', checkInData);
    
    const response = await axios.put(`${API_URL}/Reservations/check-in`, checkInData);
    
    console.log('✅ Check-in response:', response);

    return {
      success: true,
      data: response.data,
      message: response.data.message || "Check-in thành công"
    };
  } catch (error) {
    console.error('❌ Check-in error:', error);
    console.error('Error response:', error.response?.data);
    
    // ✅ Log chi tiết validation errors
    if (error.response?.data?.errors) {
      console.error('🔍 Validation errors:', error.response.data.errors);
    }
    
    return {
      success: false,
      message: error.response?.data?.errors 
        ? JSON.stringify(error.response.data.errors)
        : error.response?.data?.message || "Không thể check-in"
    };
  }
};