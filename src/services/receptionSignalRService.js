import * as signalR from '@microsoft/signalr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

class ReceptionSignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async startConnection() {
    if (this.connection && this.isConnected) {
      console.log('⚠️ Reception SignalR already connected');
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/receptionHub`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await this.connection.start();
      this.isConnected = true;
      console.log('✅ Reception SignalR Connected');
      
      await this.connection.invoke('JoinReceptionGroup');
      console.log('✅ Joined ReceptionGroup');
      console.log('⏱️ Waiting for background service (pushes every 10 seconds)...');
    } catch (err) {
      this.isConnected = false;
      console.error('❌ Reception SignalR Connection Error:', err);
    }

    this.connection.onreconnected(() => {
      console.log('🔄 Reception SignalR Reconnected');
      this.isConnected = true;
      this.connection.invoke('JoinReceptionGroup');
    });

    this.connection.onclose(() => {
      console.log('🔴 Reception SignalR Connection Closed');
      this.isConnected = false;
    });
  }

  onDashboardUpdate(callback) {
    if (this.connection) {
      // Backend đang gửi: ReceiveReceptionUpdate (không phải ReceiveDashboardUpdate)
      const variants = ['ReceiveReceptionUpdate', 'ReceiveDashboardUpdate', 'DashboardUpdate'];
      variants.forEach((name) => {
        try {
          this.connection.off(name);
        } catch {}
        this.connection.on(name, (data) => {
          console.log(`📊 [${name}] Reception Update:`, data);
          callback(data);
        });
      });
    }
  }

  onNewCheckIn(callback) {
    if (this.connection) {
      const variants = ['ReceiveNewCheckIn', 'NewCheckIn', 'NotifyCheckIn'];
      variants.forEach((name) => {
        try {
          this.connection.off(name);
        } catch {}
        this.connection.on(name, (data) => {
          console.log(`🟢 [${name}] New Check-In:`, data);
          callback(data);
        });
      });
    }
  }

  onNewCheckOut(callback) {
    if (this.connection) {
      const variants = ['ReceiveNewCheckOut', 'NewCheckOut', 'NotifyCheckOut'];
      variants.forEach((name) => {
        try {
          this.connection.off(name);
        } catch {}
        this.connection.on(name, (data) => {
          console.log(`🔴 [${name}] New Check-Out:`, data);
          callback(data);
        });
      });
    }
  }

  onRoomStatusUpdate(callback) {
    if (this.connection) {
      const variants = ['ReceiveRoomStatusUpdate', 'RoomStatusUpdate'];
      variants.forEach((name) => {
        try {
          this.connection.off(name);
        } catch {}
        this.connection.on(name, (data) => {
          console.log(`🏠 [${name}] Room Status Update:`, data);
          callback(data);
        });
      });
    }
  }

  onNewBooking(callback) {
    if (this.connection) {
      const variants = ['ReceiveNewBooking', 'NewBooking', 'NotifyReservation'];
      variants.forEach((name) => {
        try {
          this.connection.off(name);
        } catch {}
        this.connection.on(name, (data) => {
          console.log(`📅 [${name}] New Booking:`, data);
          callback(data);
        });
      });
    }
  }

  async stopConnection() {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.invoke('LeaveReceptionGroup');
        await this.connection.stop();
        this.isConnected = false;
        console.log('🔴 Reception SignalR Disconnected');
      } catch (err) {
        console.error('❌ Error stopping reception connection:', err);
      }
    }
  }
}

export default new ReceptionSignalRService();
