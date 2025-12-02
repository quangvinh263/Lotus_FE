import * as signalR from '@microsoft/signalr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async startConnection() {
    // ✅ Tránh kết nối lại nếu đã connected
    if (this.connection && this.isConnected) {
      console.log('⚠️ SignalR already connected');
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/analyticsHub`, { // ✅ Đúng URL
        skipNegotiation: false, // ✅ Đổi thành false để negotiate
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await this.connection.start();
      this.isConnected = true;
      console.log('✅ SignalR Connected');
      
      // Join analytics group
      await this.connection.invoke('JoinAnalyticsGroup');
      console.log('✅ Joined AnalyticsGroup');
    } catch (err) {
      this.isConnected = false;
      console.error('❌ SignalR Connection Error:', err);
    }

    // ✅ Xử lý reconnect
    this.connection.onreconnected(() => {
      console.log('🔄 SignalR Reconnected');
      this.isConnected = true;
      this.connection.invoke('JoinAnalyticsGroup');
    });

    this.connection.onclose(() => {
      console.log('🔴 SignalR Connection Closed');
      this.isConnected = false;
    });
  }

  onAnalyticsUpdate(callback) {
    if (this.connection) {
      this.connection.on('ReceiveAnalyticsUpdate', (data) => {
        callback(data);
      });
    }
  }

  async stopConnection() {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('LeaveAnalyticsGroup');
        await this.connection.stop();
        this.isConnected = false;
        console.log('🔴 SignalR Disconnected');
      } catch (err) {
        console.error('❌ Error stopping connection:', err);
      }
    }
  }
}

export default new SignalRService();