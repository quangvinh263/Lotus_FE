import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

// Lấy toàn bộ dữ liệu dashboard cho Reception (thống kê + check-in + check-out)
export const getReceptionDashboard = async () => {   
    try {
        const response = await axios.get(`${API_URL}/ReceptionDashboard`);
        
        console.log('Reception Dashboard Response:', response.data);
        
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
        console.error('Error fetching reception dashboard:', error);
        return {
            success: false,
            message: error.response?.data?.message || "Không thể kết nối tới máy chủ.",
        };
    }
}
