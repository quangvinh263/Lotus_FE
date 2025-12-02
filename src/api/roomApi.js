import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

// Lấy thống kê phòng
export const getRoomStatistics = async () => {
    try {
        const response = await axios.get(`${API_URL}/Rooms/stats`);
        
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        // Backend trả về trực tiếp object, KHÔNG CÓ success flag
        if (response.status === 200 && response.data) {
            console.log('Trả về success với data:', response.data);
            return {
                success: true,
                statistics: response.data, // Lấy trực tiếp response.data
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        console.error('Error:', error);
        console.error('Error response:', error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
};

// Tìm kiếm/Lọc phòng với filter
export const searchRooms = async (filterParams = {}) => {
    try {
        console.log('Gọi API searchRooms với params:', filterParams);
        
        // Chuẩn bị query params theo format backend
        const params = {};
        
        // Keyword (roomNumber search)
        if (filterParams.keyword) {
            params.Keyword = filterParams.keyword;
        }
        
        // TypeName (room type filter)
        if (filterParams.typeName && filterParams.typeName !== 'Tất cả') {
            params.TypeName = filterParams.typeName;
        }
        
        // Status filter
        if (filterParams.status && filterParams.status !== 'Tất cả') {
            params.Status = filterParams.status;
        }
        
        console.log('Query params gửi đi:', params);
        
        const response = await axios.get(`${API_URL}/Rooms`, {
            params: params // Axios tự động encode thành ?Keyword=xxx&TypeName=yyy
        });
        
        console.log('Search response status:', response.status);
        console.log('Search response data:', response.data);
        
        if (response.status === 200 && response.data) {
            return {
                success: true,
                rooms: response.data, 
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
            rooms: []
        };
    } catch (error) {
        console.error('Search error:', error);
        console.error('Search error response:', error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Không thể tìm kiếm phòng.",
            rooms: []
        };
    }
};

// Xóa phòng
export const deleteRoom = async (roomId) => {
    try {
        console.log('🗑️ Gọi API deleteRoom với id:', roomId);
        const response = await axios.delete(`${API_URL}/Rooms/${roomId}`);
        console.log('Delete room response:', response);
        if (response.status === 200 || response.status === 204) {
            return {
                success: true,
                message: response.data?.message || "Xóa phòng thành công"
            };
        } else {
            return {
                success: false,
                message: response.data?.message || "Không thể xóa phòng"
            };
        }
    } catch (error) {
        console.error('Delete room error:', error);
        return {
            success: false,
            message: error.response?.data?.message || "Không thể xóa phòng"
        };
    }
};

export const addRoom = async (roomData) => {
    try {
        const requestBody = {
            RoomNumber: roomData.roomNumber,
            TypeName: roomData.typeName,
            Floor: roomData.floor,
        };

        console.log('Gọi API addRoom với body:', requestBody);

        const response = await axios.post(`${API_URL}/Rooms`, requestBody);

        console.log('Add room response:', response);

        if (response.status === 201 || response.status === 200) {
            return {
                success: true,
                message: response.data?.message || "Tạo phòng thành công"
            };
        } else {
            return {
                success: false,
                message: response.data?.message || "Không thể tạo phòng"
            };
        }
    } catch (error) {
        console.error('Add room error:', error);
        return {
            success: false,
            message: error.response?.data?.message || "Không thể tạo phòng"
        };
    }
};

// Cập nhật phòng
export const updateRoom = async (roomId, roomData) => {
    try {
        const requestBody = {
            RoomId: roomId,
            RoomNumber: roomData.roomNumber,
            TypeName: roomData.typeName,
            Floor: roomData.floor,
            Status: roomData.status
        };

        console.log('✏️ Gọi API updateRoom với body:', requestBody);

        const response = await axios.put(`${API_URL}/Rooms/${roomId}`, requestBody);

        console.log('Update room response:', response);

        if (response.status === 200) {
            return {
                success: true,
                message: response.data?.message || "Cập nhật phòng thành công",
                room: response.data?.data
            };
        } else {
            return {
                success: false,
                message: response.data?.message || "Không thể cập nhật phòng"
            };
        }
    } catch (error) {
        console.error('❌ Update room error:', error);
        return {
            success: false,
            message: error.response?.data?.message || "Không thể cập nhật phòng"
        };
    }
};