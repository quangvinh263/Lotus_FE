import * as signalR from '@microsoft/signalr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }
    async startConnection() {
    if (this.connection && this.isConnected) {
      console.log('⚠️ SignalR already connected');
      return;
    }
    this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}/revenueStatisticsHub`)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();
    try {
        await this.connection.start();
        this.isConnected = true;
        console.log('✅ SignalR Connected');
        
        // ✅ Đợi 100ms để đảm bảo kết nối hoàn toàn sẵn sàng
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.connection.invoke('JoinRevenueStatisticsGroup');
        console.log('✅ Joined RevenueStatisticsGroup');
    } catch (error) {
        console.error('❌ SignalR Connection Error:', error);
    }
}
    async stopConnection() {
    if (this.connection && this.isConnected) {
        await this.connection.invoke('LeaveRevenueStatisticsGroup');
        await this.connection.stop();
        this.isConnected = false;
        console.log('✅ SignalR Disconnected');
    }
}
    onAnalyticsUpdate(callback) {
    if (this.connection) {
        // ✅ Sửa tên event cho đúng với BE
        this.connection.on('ReceiveRevenueStatisticsUpdate', (data) => {
            callback(data);
        });
    }
}
}

export default new SignalRService();