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

export const createBooking = async (bookingData) => {
    try {
        // Map frontend data to backend format
        const requestData = {
            customerID: bookingData.customerId,
            checkInDate: new Date(bookingData.checkIn).toISOString().split('T')[0], // Format: YYYY-MM-DD
            checkOutDate: new Date(bookingData.checkOut).toISOString().split('T')[0],
            details: bookingData.rooms.map(room => ({
                typeID: room.roomTypeId,
                roomCount: room.numberOfRooms,
                peopleNumber: room.guestsPerRoom
            }))
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