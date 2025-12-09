import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

// Lấy dữ liệu phân tích từ database
export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/Campaign/analytics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể lấy dữ liệu phân tích.",
    };
  }
};

// Lấy danh sách câu hỏi gợi ý (cho Gemini)
export const getAvailableQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/Campaign/questions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể lấy danh sách câu hỏi.",
    };
  }
};

// Tạo insight dựa trên questionId (Gửi yêu cầu tới Gemini)
export const generateInsight = async (questionId) => {
  try {
    const response = await axios.post(`${API_URL}/Campaign/generate/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("Error generating insight:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể tạo insight.",
    };
  }
};