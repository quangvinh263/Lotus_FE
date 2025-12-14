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
            params.status = statusFilter;
        }
        if (keyword && keyword.trim()) {
            params.keyword = keyword.trim();
        }

        console.log('API Request - getBookingsList:', { statusFilter, keyword, params });
        const response = await axios.get(`${API_URL}/Reservations/list`, { params });
        
        console.log('Bookings List Response:', { count: response.data?.length, data: response.data });
        
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

export const cancelBooking = async (reservationId) => {
    try {
        console.log('Canceling booking with ID:', reservationId);
        
        const response = await axios.put(`${API_URL}/Reservations/${reservationId}/cancel`);
        
        console.log('Cancel Booking Response:', response.data);
        
        if (response.status === 200) {
            return {
                success: true,
                message: response.data?.message || "Hủy đơn đặt phòng thành công",
                data: response.data
            };
        }

        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        console.error('Error canceling booking:', error);
        console.error('Error details:', error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.response?.data || "Không thể hủy đơn đặt phòng.",
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
export const createBooking = async (bookingData) => {
    try {
        // Helper function to format date without timezone issues
        const formatDateYYYYMMDD = (date) => {
            if (!date) return '';
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Map frontend data to backend format
        const requestData = {
            customerID: bookingData.customerId,
            checkInDate: formatDateYYYYMMDD(bookingData.checkIn),
            checkOutDate: formatDateYYYYMMDD(bookingData.checkOut),
            details: bookingData.rooms.map(room => ({
                typeID: room.roomTypeId,
                roomCount: room.numberOfRooms,
                peopleNumber: room.guestsPerRoom
            })),
            requiresDeposit: false
        };

        console.log('Creating booking with data:', requestData);

        const response = await axios.post(`${API_URL}/Reservations/create`, requestData);
        
        console.log('Create Booking Response:', response.data);
        
        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                data: response.data,
                message: "Tạo đơn đặt phòng thành công!"
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        console.error('Error creating booking:', error);
        return {
            success: false,
            message: error.response?.data?.message || error.response?.data?.title || "Không thể tạo đơn đặt phòng.",
        };
    }
}

// Create online booking (requires deposit payment)
export const createOnlineBooking = async (bookingData) => {
    try {
        // Helper function to format date without timezone issues
        const formatDateYYYYMMDD = (date) => {
            if (!date) return '';
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Map frontend data to backend format
        const requestData = {
            customerID: bookingData.customerId,
            checkInDate: formatDateYYYYMMDD(bookingData.checkIn),
            checkOutDate: formatDateYYYYMMDD(bookingData.checkOut),
            details: bookingData.rooms.map(room => ({
                typeID: room.roomTypeId,
                roomCount: room.numberOfRooms,
                peopleNumber: room.guestsPerRoom
            })),
            requiresDeposit: true
        };

        console.log('Creating online booking with data:', requestData);

        const response = await axios.post(`${API_URL}/Reservations/create`, requestData);
        
        console.log('Create Online Booking Response:', response.data);
        
        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                data: response.data,
                message: "Tạo đơn đặt phòng thành công!"
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        console.error('Error creating online booking:', error);
        return {
            success: false,
            message: error.response?.data?.message || error.response?.data?.title || "Không thể tạo đơn đặt phòng.",
        };
    }
}

export const getUpcomingBookings = async (accountId) => {
    try {
        const response = await axios.get(`${API_URL}/Reservations/upcoming/${accountId}`);
        console.log('Upcoming Bookings Response:', response.data);
        
        if (response.status === 200 && response.data) {
            return { success: true, data: response.data };
        }
        return { success: false, message: "Response không hợp lệ" };
    } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        return { success: false, message: error.response?.data?.message || "Lỗi kết nối." };
    }
}

export const getPastBookings = async (accountId) => {
    try {
        // Giả định endpoint backend là /Reservations/history và dùng POST giống upcoming
        const response = await axios.get(`${API_URL}/Reservations/past/${accountId}`)
        
        if (response.status === 200 && response.data) {
            return {
                success: true,
                data: response.data
            };
        }
      } catch (error) {
        console.error('Error fetching past bookings:', error);
        return {
            success: false,
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
}
// Check-out booking - calls backend for each reservationDetailId individually
export const checkOutBooking = async (reservationDetailId) => {
    try {
        console.log('📤 Calling check-out API for detail:', reservationDetailId);
        
        const response = await axios.post(`${API_URL}/Reservations/check-out/${reservationDetailId}`);
        
        console.log('📥 Check-out response:', response.data);
        
        if (response.status === 200) {
            return {
                success: true,
                data: response.data,
                message: response.data?.message || "Check-out thành công"
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        
        console.error('❌ Check-out error for detail:', reservationDetailId);
        console.error('❌ Error status:', error.response?.status);
        console.error('❌ Error data:', error.response?.data);
        console.error('❌ Full error:', error);
        
        let errorMessage = "Không thể check-out.";
        
        if (error.response?.data) {
            // Try to extract meaningful error message
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.title) {
                errorMessage = error.response.data.title;
            } else if (error.response.data.errors) {
                errorMessage = JSON.stringify(error.response.data.errors);
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        return {
            success: false,
            message: errorMessage,
            error: error.response?.data
        };
    }
}
