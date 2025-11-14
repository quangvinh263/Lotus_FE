import React from 'react';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import CheckInIcon from '../../assets/icons/CheckInIcon.svg';
import CheckOutIcon from '../../assets/icons/CheckOutIcon.svg';
import './ReceptionDashboard.css';

const ReceptionDashboard = () => {
  const overviewStats = [
    { label: 'Check-in', sublabel: 'Hôm nay', value: '23' },
    { label: 'Check-out', sublabel: 'Hôm nay', value: '13' },
    { label: 'Phòng', sublabel: 'Tất cả', value: '100' },
    { label: 'Phòng trống', sublabel: 'Tất cả', value: '14' },
    { label: 'Phòng đã đặt', sublabel: 'Tất cả', value: '26' },
    { label: 'Phòng đang ở', sublabel: 'Tất cả', value: '60' },
  ];

  const roomStatus = [
    { label: 'Phòng trống', count: '14 phòng', percentage: '14%', color: 'green' },
    { label: 'Đã đặt', count: '26 phòng', percentage: '26%', color: 'blue' },
    { label: 'Đang ở', count: '60 phòng', percentage: '60%', color: 'yellow' },
  ];

  const checkInList = [
    { name: 'Nguyễn Văn A', code: 'KB001', status: 'waiting' },
    { name: 'Nguyễn Văn A', code: 'KB001', status: 'waiting' },
    { name: 'Nguyễn Văn A', code: 'KB001', status: 'waiting' },
  ];

  const checkOutList = [
    { name: 'Nguyễn Văn A', code: 'KB001', status: 'waiting' },
    { name: 'Nguyễn Văn A', code: 'KB001', status: 'waiting' },
    { name: 'Nguyễn Văn A', code: 'KB001', status: 'waiting' },
  ];

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
                <span className="badge">3</span>
              </div>
              <div className="guest-list">
                {checkInList.map((guest, index) => (
                  <div key={index} className="guest-item">
                    <div className="guest-info">
                      <div className="guest-details">
                        <p className="guest-name">{guest.name}</p>
                        <p className="guest-code">Mã: {guest.code}</p>
                      </div>
                    </div>
                    <span className="guest-status waiting">Chờ</span>
                  </div>
                ))}
              </div>
              <button className="view-all-btn">
                <img src={CheckInIcon} alt="Check-in" className="btn-icon" />
                <span>Xem tất cả Check-in</span>
              </button>
            </div>

            {/* Pending Check-out Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Dự kiến check-out</h3>
                <span className="badge">3</span>
              </div>
              <div className="guest-list">
                {checkOutList.map((guest, index) => (
                  <div key={index} className="guest-item">
                    <div className="guest-info">
                      <div className="guest-details">
                        <p className="guest-name">{guest.name}</p>
                        <p className="guest-code">Mã: {guest.code}</p>
                      </div>
                    </div>
                    <span className="guest-status waiting">Chờ</span>
                  </div>
                ))}
              </div>
              <button className="view-all-btn">
                <img src={CheckOutIcon} alt="Check-out" className="btn-icon" />
                <span>Xem tất cả Check-out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
