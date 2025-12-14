import axios from "./axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

// Manual payment (cash)
export const processManualPayment = async (invoiceId, amount, paymentData = {}) => {
    try {
        const requestBody = {
            id: invoiceId,
            amount: amount,
            method: paymentData.method || 'Cash',
            transactionRef: paymentData.transactionRef || null,
            payerName: paymentData.payerName || null,
            payerPhone: paymentData.payerPhone || null,
            note: paymentData.note || null,
            bankCode: paymentData.bankCode || null
        };
        
        console.log('📤 Processing manual payment:', requestBody);
        
        const response = await axios.post(`${API_URL}/Payments/invoices/manual`, requestBody);
        
        console.log('✅ Manual payment response:', response.data);
        
        if (response.status === 200) {
            return {
                success: true,
                data: response.data,
                message: response.data?.message || "Thanh toán thành công"
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        console.error('❌ Manual payment error:', error);
        console.error('Error response:', error.response?.data);
        
        let errorMessage = "Không thể thanh toán.";
        
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.title) {
                errorMessage = error.response.data.title;
            }
        }
        
        return {
            success: false,
            message: errorMessage,
        };
    }
};

// ZaloPay payment
export const processZaloPayPayment = async (invoiceId) => {
    try {
        console.log('📤 Processing ZaloPay payment:', invoiceId);
        
        const response = await axios.post(`${API_URL}/Payments/invoices/${invoiceId}/zalopay`);
        
        console.log('✅ ZaloPay payment response:', response.data);
        
        if (response.status === 200) {
            return {
                success: true,
                data: response.data,
                message: response.data?.message || "Tạo link thanh toán ZaloPay thành công"
            };
        }
        
        return {
            success: false,
            message: "Response không hợp lệ",
        };
    } catch (error) {
        console.error('❌ ZaloPay payment error:', error);
        console.error('Error response:', error.response?.data);
        
        let errorMessage = "Không thể tạo link thanh toán ZaloPay.";
        
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.title) {
                errorMessage = error.response.data.title;
            }
        }
        
        return {
            success: false,
            message: errorMessage,
        };
    }
};

// ZaloPay deposit payment (cọc)
export const processDepositZaloPayPayment = async (reservationId, amount) => {
    try {
        console.log('📤 Processing ZaloPay deposit payment:', { reservationId, amount });
        
        const requestBody = {
            reservationId: reservationId,
            amount: amount
        };
        
        const response = await axios.post(`${API_URL}/Payments/deposits/zalopay`, requestBody);
        
        console.log('✅ ZaloPay deposit payment response:', response.data);
        
        if (response.status === 200 && response.data?.isSuccess) {
            return {
                success: true,
                data: response.data,
                paymentUrl: response.data.paymentUrl,
                paymentId: response.data.paymentId,
                message: response.data?.message || "Tạo link thanh toán cọc ZaloPay thành công"
            };
        }
        
        return {
            success: false,
            message: response.data?.message || "Response không hợp lệ",
        };
    } catch (error) {
        console.error('❌ ZaloPay deposit payment error:', error);
        console.error('Error response:', error.response?.data);
        
        let errorMessage = "Không thể tạo link thanh toán cọc ZaloPay.";
        
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.title) {
                errorMessage = error.response.data.title;
            }
        }
        
        return {
            success: false,
            message: errorMessage,
        };
    }
};
