import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import CheckInIcon from '../../assets/icons/CheckInIcon.svg';
import CheckOutIcon from '../../assets/icons/CheckOutIcon.svg';
import receptionSignalRService from '../../services/receptionSignalRService';
import { getReceptionDashboard } from '../../api/receptionApi';
import './ReceptionDashboard.css';

const ReceptionDashboard = () => {
  // State cho các thống kê
  const [overviewStats, setOverviewStats] = useState([
    { label: 'Check-in', sublabel: 'Hôm nay', value: '0' },
    { label: 'Check-out', sublabel: 'Hôm nay', value: '0' },
    { label: 'Phòng', sublabel: 'Tất cả', value: '0' },
    { label: 'Phòng trống', sublabel: 'Tất cả', value: '0' },
    { label: 'Phòng đã đặt', sublabel: 'Tất cả', value: '0' },
    { label: 'Phòng đang ở', sublabel: 'Tất cả', value: '0' },
  ]);

  const [roomStatus, setRoomStatus] = useState([
    { label: 'Phòng trống', count: '0 phòng', percentage: '0%', color: 'green' },
    { label: 'Đã đặt', count: '0 phòng', percentage: '0%', color: 'blue' },
    { label: 'Đang ở', count: '0 phòng', percentage: '0%', color: 'yellow' },
  ]);

  const [checkInList, setCheckInList] = useState([]);
  const [checkOutList, setCheckOutList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const result = await getReceptionDashboard();

      if (result.success && result.data) {
        // Parse backend response
        const data = result.data;
        
        // Map backend data sang format của updateDashboardData
        const mappedData = {
          checkInToday: data.todayCheckInCount || data.todayCheckIns || 0,
          checkOutToday: data.todayCheckOutCount || data.todayCheckOuts || 0,
          rooms: {
            totalRooms: data.totalRooms || 0,
            availableRooms: data.availableRooms || 0,
            reservedRooms: data.bookedRooms || 0, // Backend dùng "bookedRooms"
            occupiedRooms: data.occupiedRooms || 0
          }
        };
        
        // Cập nhật thống kê dashboard
        updateDashboardData(mappedData);
        
        // Cập nhật danh sách check-in
        if (data.todayCheckInList) {
          setCheckInList(data.todayCheckInList);
        }
        
        // Cập nhật danh sách check-out
        if (data.todayCheckOutList) {
          setCheckOutList(data.todayCheckOutList);
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Khởi tạo SignalR connection và load data
  useEffect(() => {
    const connectSignalR = async () => {
      // Load dữ liệu ban đầu
      await fetchDashboardData();
      
      // Kết nối SignalR
      await receptionSignalRService.startConnection();

      // Lắng nghe Dashboard Update
      receptionSignalRService.onDashboardUpdate((response) => {
        console.log('📊 Dashboard Update received:', response);
        const data = response.data || response;
        
        // Map backend data sang format của updateDashboardData
        const mappedData = {
          checkInToday: data.todayCheckInCount || data.todayCheckIns || 0,
          checkOutToday: data.todayCheckOutCount || data.todayCheckOuts || 0,
          rooms: {
            totalRooms: data.totalRooms || 0,
            availableRooms: data.availableRooms || 0,
            reservedRooms: data.bookedRooms || 0,
            occupiedRooms: data.occupiedRooms || 0
          }
        };
        
        updateDashboardData(mappedData);
        
        // Cập nhật danh sách
        if (data.todayCheckInList) {
          setCheckInList(data.todayCheckInList);
        }
        if (data.todayCheckOutList) {
          setCheckOutList(data.todayCheckOutList);
        }
      });

      // Lắng nghe Check-in mới
      receptionSignalRService.onNewCheckIn((data) => {
        console.log('🟢 New Check-in received:', data);
        // Refresh danh sách check-in
        fetchDashboardData();
      });

      // Lắng nghe Check-out mới
      receptionSignalRService.onNewCheckOut((data) => {
        console.log('🔴 New Check-out received:', data);
        // Refresh danh sách check-out
        fetchDashboardData();
      });

      // Lắng nghe Room Status Update
      receptionSignalRService.onRoomStatusUpdate((data) => {
        console.log('🏠 Room status updated:', data);
        // Refresh toàn bộ dashboard
        fetchDashboardData();
      });

      // Lắng nghe Booking mới
      receptionSignalRService.onNewBooking((data) => {
        console.log('📅 New booking received:', data);
        // Refresh dashboard để cập nhật phòng đã đặt
        fetchDashboardData();
      });
    };

    connectSignalR();

    return () => {
      receptionSignalRService.stopConnection();
    };
  }, []);

  const navigate = useNavigate();

  // Hàm cập nhật dashboard data
  const updateDashboardData = (data) => {
    const { checkInToday, checkOutToday, rooms } = data;

    // Cập nhật overview stats
    setOverviewStats([
      { label: 'Check-in', sublabel: 'Hôm nay', value: checkInToday.toString() },
      { label: 'Check-out', sublabel: 'Hôm nay', value: checkOutToday.toString() },
      { label: 'Phòng', sublabel: 'Tất cả', value: rooms.totalRooms.toString() },
      { label: 'Phòng trống', sublabel: 'Tất cả', value: rooms.availableRooms.toString() },
      { label: 'Phòng đã đặt', sublabel: 'Tất cả', value: rooms.reservedRooms.toString() },
      { label: 'Phòng đang ở', sublabel: 'Tất cả', value: rooms.occupiedRooms.toString() },
    ]);

    // Tính phần trăm
    const total = rooms.totalRooms || 1; // Tránh chia 0
    const availablePercent = ((rooms.availableRooms / total) * 100).toFixed(0);
    const reservedPercent = ((rooms.reservedRooms / total) * 100).toFixed(0);
    const occupiedPercent = ((rooms.occupiedRooms / total) * 100).toFixed(0);

    // Cập nhật room status
    setRoomStatus([
      { 
        label: 'Phòng trống', 
        count: `${rooms.availableRooms} phòng`, 
        percentage: `${availablePercent}%`, 
        color: 'green' 
      },
      { 
        label: 'Đã đặt', 
        count: `${rooms.reservedRooms} phòng`, 
        percentage: `${reservedPercent}%`, 
        color: 'blue' 
      },
      { 
        label: 'Đang ở', 
        count: `${rooms.occupiedRooms} phòng`, 
        percentage: `${occupiedPercent}%`, 
        color: 'yellow' 
      },
    ]);
  };

  return (
    <div className="reception-dashboard-page">
      <Sidebar />
      
      <div className="dashboard-main">
        <TopBar />
        
        <div className="dashboard-content">
          {/* Header Section */}
          <div className="dashboard-header">
            <h1 className="page-title">Tổng quan</h1>
            <p className="page-subtitle">Thông tin tổng quan về hoạt động khách sạn hôm nay</p>
          </div>

          {/* Overview Statistics */}
          <div className="overview-section">
            <div className="overview-card">
              <h3 className="card-title">Tổng Quan</h3>
              <div className="stats-grid">
                {overviewStats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-labels">
                      <span className="stat-sublabel">{stat.sublabel}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                    <span className="stat-value">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="cards-grid">
            {/* Room Status Card */}
            <div className="dashboard-card">
              <h3 className="card-title">Tình trạng phòng</h3>
              <div className="room-status-list">
                {roomStatus.map((status, index) => (
                  <div key={index} className={`room-status-item status-${status.color}`}>
                    <div className="status-content">
                      <div className="status-info">
                        <p className="status-label">{status.label}</p>
                        <p className="status-count">{status.count}</p>
                      </div>
                      <div className="status-percentage">{status.percentage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Check-in Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Dự kiến check-in</h3>
                <span className="badge">{checkInList.length}</span>
              </div>
              <div className="card-body">
                <div className="guest-list">
                  {checkInList.length > 0 ? checkInList.map((guest, index) => (
                    <div key={index} className="guest-item">
                      <div className="guest-info">
                        <div className="guest-details">
                          <p className="guest-name">{guest.customerName}</p>
                          <p className="guest-code">Mã: {guest.reservationId}</p>
                        </div>
                      </div>
                      <span className={`guest-status ${guest.status?.toLowerCase() || 'waiting'}`}>
                        {guest.status === 'Waiting' ? 'Chờ' : guest.status}
                      </span>
                    </div>
                  )) : (
                    <p className="no-data">Không có check-in hôm nay</p>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="view-all-btn"
                  onClick={() => navigate('/reception/checkin')}
                >
                  <img src={CheckInIcon} alt="Check-in" className="btn-icon" />
                  <span>Xem tất cả Check-in</span>
                </button>
              </div>
            </div>

            {/* Pending Check-out Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Dự kiến check-out</h3>
                <span className="badge">{checkOutList.length}</span>
              </div>
              <div className="card-body">
                <div className="guest-list">
                  {checkOutList.length > 0 ? checkOutList.map((guest, index) => (
                    <div key={index} className="guest-item">
                      <div className="guest-info">
                        <div className="guest-details">
                          <p className="guest-name">{guest.name}</p>
                          <p className="guest-code">Mã: {guest.code}</p>
                        </div>
                      </div>
                      <span className="guest-status waiting">Chờ</span>
                    </div>
                  )) : (
                    <p className="no-data">Không có check-out hôm nay</p>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="view-all-btn"
                  onClick={() => navigate('/reception/checkout')}
                >
                  <img src={CheckOutIcon} alt="Check-out" className="btn-icon" />
                  <span>Xem tất cả Check-out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
