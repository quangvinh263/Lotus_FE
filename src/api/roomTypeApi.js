import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

// Lấy thống kê loại phòng
export const getRoomTypeStatistics = async () => {
    try {
        const response = await axios.get(`${API_URL}/RoomTypes/statistic`);
        
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

// Lấy danh sách loại phòng
export const getAllRoomTypes = async () => {
    try {
        console.log('Đang gọi API GET /RoomTypes...');
        
        const response = await axios.get(`${API_URL}/RoomTypes`);
        
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        if (response.status === 200 && Array.isArray(response.data)) {
            // Map data từ backend, loại bỏ urlImage
            const roomTypes = response.data.map(rt => ({
                id: rt.roomTypeId,
                name: rt.roomTypeName.replace(' Room', ''), // "Deluxe Room" -> "Deluxe"
                size: `${rt.square}m²`,
                capacity: rt.capacity,
                price: rt.averagePriceForThreeNight,
                totalRooms: rt.roomCount,
                availableRooms: rt.roomCountIsAvailable,
                description: rt.description || '',
                feature: rt.feature || ''
            }));
            
            console.log('Room types sau khi map:', roomTypes);
            
            return {
                success: true,
                roomTypes: roomTypes
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

// Thêm loại phòng mới
export const addRoomType = async (roomTypeData) => {
    try {
        console.log('Đang gọi API POST /RoomTypes...');
        console.log('Request data:', roomTypeData);
        
        const response = await axios.post(`${API_URL}/RoomTypes`, roomTypeData);
        
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        if (response.status === 201 || response.status === 200) {
            return {
                success: true,
                message: "Thêm loại phòng thành công!",
                data: response.data
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
            message: error.response?.data?.message || error.response?.data || "Không thể thêm loại phòng.",
        };
    }
};

// Xóa loại phòng
export const deleteRoomType = async (roomTypeId) => {
    try {
        console.log('Đang gọi API DELETE /RoomTypes/' + roomTypeId);
        
        const response = await axios.delete(`${API_URL}/RoomTypes/${roomTypeId}`);
        
        console.log('Response status:', response.status);
        
        if (response.status === 204 || response.status === 200) {
            return {
                success: true,
                message: "Xóa loại phòng thành công!",
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
            message: error.response?.data?.message || "Không thể xóa loại phòng.",
        };
    }
};

// Cập nhật loại phòng
export const updateRoomType = async (roomTypeId, roomTypeData) => {
    try {
        console.log('🔄 Đang gọi API PUT /RoomTypes/' + roomTypeId);
        console.log('📦 Request data:', roomTypeData);
        
        const response = await axios.put(`${API_URL}/RoomTypes/${roomTypeId}`, roomTypeData);
        
        console.log('✅ Response status:', response.status);
        console.log('📦 Response data:', response.data);
        
        if (response.status === 200 || response.status === 204) {
            return {
                success: true,
                message: "Cập nhật loại phòng thành công!",
                data: response.data
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        console.error('❌ Error:', error);
        console.error('❌ Error response:', error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || "Không thể cập nhật loại phòng.",
        };
    }
};

export const getRoomOverview = async () => {
    try {
        const response = await axios.get(`${API_URL}/RoomTypes/overview`);
        if (response.status === 200 && response.data) {
            return {
                success: true,
                overview: response.data,
            };
        }
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
};

export const getRoomTypeById = async (roomTypeId) => {
    try {
        const response = await axios.get(`${API_URL}/RoomTypes/${roomTypeId}`);
        if (response.status === 200 && response.data) {
            return {
                success: true,
                roomType: response.data,
            };
        }
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
};

export const getAvailableRoomTypesByFilter = async (filterData) => {
  try {
    // Format date to YYYY-MM-DD
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (`0${d.getMonth() + 1}`).slice(-2);
      const day = (`0${d.getDate()}`).slice(-2);
      return `${year}-${month}-${day}`;
    };

    const requestBody = {
      typeName: "", // Mặc định rỗng để lấy tất cả
      capacity: Math.ceil(filterData.guests / filterData.rooms), // Số khách chia đều cho số phòng
      from: formatDate(filterData.checkInDate),
      to: formatDate(filterData.checkOutDate)
    };

    console.log('🔍 Searching rooms with body:', requestBody);

    const response = await axios.post(`${API_URL}/RoomTypes/GetTypes`, requestBody); 
    // Lưu ý: Endpoint có thể khác tùy backend của bạn, ở đây tôi giả định là /room-types/search hoặc tương tự dựa trên context cũ
    // Nếu endpoint là getAvailableRoomTypesByFilter thì thay thế vào.
    
    // Giả sử endpoint thực tế bạn đang dùng để search
    // const response = await axiosInstance.post('/RoomTypes/available-rooms', requestBody); 

    return response.data;
  } catch (error) {
    console.error('❌ Error searching rooms:', error);
    throw error;
  }
};