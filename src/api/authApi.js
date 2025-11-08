import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;
export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    
    // Nếu server trả success = true hoặc statusCode = 201
    if (response.status === 201 || response.data.success === true) {
      return {
        success: true,
        message:
          response.data.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để xác minh.",
      };
    }

    // Một số API có thể trả 200 nhưng success=false
    return {
      success: false,
      message: response.data.message || "Có lỗi xảy ra khi đăng ký.",
    };
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      // ✅ Xử lý theo mã HTTP
      switch (status) {
        case 400:
          return {
            success: false,
            message: data.message || "Dữ liệu không hợp lệ.",
          };
        case 409:
          return {
            success: false,
            message:
              data.message ||
              "Email hoặc tên người dùng đã tồn tại. Vui lòng kiểm tra lại.",
          };
        case 500:
          return {
            success: false,
            message: "Lỗi máy chủ. Vui lòng thử lại sau.",
          };
        default:
          return {
            success: false,
            message: data.message || "Đăng ký thất bại.",
          };
      }
    } else {
      return {
        success: false,
        message: "Không thể kết nối tới máy chủ.",
      };
    }
  }
};

export const loginUser = async (data) => {
  try{
    const response = await axios.post(`${API_URL}/auth/login`, data);
    console.log("✅ Login API response:", response.data);
    return {
      success: true,
      message: response.data.message,
      token: response.data.token,
      refreshToken: response.data.refreshToken,
      accountId: response.data.accountID,
    };
  }
  catch (error) {
    switch (error.response?.status) {
      case 401: return { success: false, message: "Thông tin đăng nhập không đúng." };
      case 404: return { success: false, message: "Không tìm thấy tài khoản" };
      case 403: return { success: false, message: "Tài khoản chưa được xác minh." };
      case 500: return { success: false, message: "Lỗi máy chủ. Vui lòng thử lại sau." };
      default:
        const message = error.response?.data?.message || "Đăng nhập thất bại.";
        return { success: false, message }; 
    }
  }
};

