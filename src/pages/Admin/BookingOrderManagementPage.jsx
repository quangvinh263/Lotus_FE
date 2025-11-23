import React, { useState } from 'react';
import '../../styles/Admin/BookingOrderManagementPage.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import BookingOrderDetailModal from '../../components/Admin/BookingOrderDetailModal';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import FilterIcon from '../../assets/icons/FilterIcon.svg';
import EyeIcon from '../../assets/icons/EyeIcon.svg';

const BookingOrderManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookingList] = useState([
    {
      id: 'KB001',
      bookingDate: '05/11/2025',
      customerName: 'Nguyễn Văn A',
      phone: '0901234567',
      roomCount: 2,
      checkIn: '10/11/2025',
      checkOut: '12/11/2025',
      nights: 2,
      totalAmount: 1600000,
      paymentStatus: 'Chưa đặt cọc',
      remainingAmount: 1100000,
      status: 'pending',
      statusText: 'Chờ xác nhận'
    },
    {
      id: 'KB002',
      bookingDate: '06/11/2025',
      customerName: 'Nguyễn Thị B',
      phone: '0901544324',
      roomCount: 2,
      checkIn: '11/11/2025',
      checkOut: '13/11/2025',
      nights: 3,
      totalAmount: 2600000,
      paymentStatus: 'Đã đặt cọc',
      remainingAmount: 1100000,
      status: 'confirmed',
      statusText: 'Đã xác nhận'
    },
    {
      id: 'KB003',
      bookingDate: '07/11/2025',
      customerName: 'Tăng Quang C',
      phone: '0901234567',
      roomCount: 3,
      checkIn: '15/11/2025',
      checkOut: '17/11/2025',
      nights: 2,
      totalAmount: 3600000,
      paymentStatus: 'Chưa thanh toán',
      remainingAmount: 1100000,
      status: 'checkedin',
      statusText: 'Đã check-in'
    },
    {
      id: 'KB004',
      bookingDate: '07/11/2025',
      customerName: 'Tăng Quang C',
      phone: '0901234567',
      roomCount: 3,
      checkIn: '15/11/2025',
      checkOut: '17/11/2025',
      nights: 2,
      totalAmount: 3600000,
      paymentStatus: 'Đã thanh toán',
      remainingAmount: 0,
      status: 'completed',
      statusText: 'Đã hoàn thành'
    },
    {
      id: 'KB005',
      bookingDate: '07/11/2025',
      customerName: 'Tăng Quang C',
      phone: '0901234567',
      roomCount: 3,
      checkIn: '15/11/2025',
      checkOut: '17/11/2025',
      nights: 2,
      totalAmount: 3600000,
      paymentStatus: 'Chưa thanh toán',
      remainingAmount: 1100000,
      status: 'cancelled',
      statusText: 'Đã hủy'
    }
  ]);

  const stats = [
    { label: 'Tổng đơn', value: '5', color: '#133E87' },
    { label: 'Chờ xác nhận', value: '1', color: '#F0B100' },
    { label: 'Đã xác nhận', value: '1', color: '#133E87' },
    { label: 'Đã check-in', value: '1', color: '#00A63E' },
    { label: 'Hoàn thành', value: '1', color: '#4A5565' },
    { label: 'Đã hủy', value: '1', color: '#FB2C36' }
  ];

  const filterButtons = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'checkedin', label: 'Đã check-in' },
    { key: 'completed', label: 'Đã hoàn thành' },
    { key: 'cancelled', label: 'Đã hủy' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F0B100';
      case 'confirmed': return '#133E87';
      case 'checkedin': return '#00A63E';
      case 'completed': return '#4A5565';
      case 'cancelled': return '#FB2C36';
      default: return '#133E87';
    }
  };

  const getPaymentColor = (paymentStatus) => {
    if (paymentStatus === 'Đã thanh toán') return '#00A63E';
    if (paymentStatus === 'Chưa thanh toán') return '#FB2C36';
    return '#F0B100';
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking({
      ...booking,
      statusColor: getStatusColor(booking.status),
      paymentStatusColor: getPaymentColor(booking.paymentStatus),
      depositAmount: 500000
    });
    setShowDetailModal(true);
  };

  const filteredBookings = activeFilter === 'all' 
    ? bookingList 
    : bookingList.filter(booking => booking.status === activeFilter);

  return (
    <div className="admin-booking-order-page">
      <AdminSidebar />
      <div className="admin-booking-order-container">
        <AdminHeader />
        <div className="admin-booking-order-main">
          {/* Header */}
          <div className="admin-booking-order-header">
            <h1 className="admin-booking-order-title">Quản lý đơn đặt phòng</h1>
            <p className="admin-booking-order-subtitle">Quản lý tất cả đơn đặt phòng trong hệ thống</p>
          </div>

          {/* Stats Cards */}
          <div className="admin-booking-order-stats">
            {stats.map((stat, index) => (
              <div key={index} className="admin-booking-order-stat-card">
                <p className="admin-booking-order-stat-label">{stat.label}</p>
                <h2 className="admin-booking-order-stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </h2>
              </div>
            ))}
          </div>

          {/* Filter Buttons */}
          <div className="admin-booking-order-filter-container">
            <div className="admin-booking-order-filter-buttons">
              {filterButtons.map((filter) => (
                <button
                  key={filter.key}
                  className={`admin-booking-order-filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="admin-booking-order-search-container">
            <div className="admin-booking-order-search-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn, tên khách, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-booking-order-search-input"
              />
              <img src={SearchIcon} alt="Search" className="admin-booking-order-search-icon" />
            </div>
            <button className="admin-booking-order-filter-action-btn">
              <img src={FilterIcon} alt="Filter" className="admin-booking-order-filter-icon" />
              <span>Lọc</span>
            </button>
          </div>

          {/* Booking Table */}
          <div className="admin-booking-order-table-container">
            <table className="admin-booking-order-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Số Phòng</th>
                  <th>Check-in/out</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="admin-booking-order-cell-primary">{booking.id}</div>
                      <div className="admin-booking-order-cell-secondary">{booking.bookingDate}</div>
                    </td>
                    <td>
                      <div className="admin-booking-order-cell-primary">{booking.customerName}</div>
                      <div className="admin-booking-order-cell-secondary">{booking.phone}</div>
                    </td>
                    <td>
                      <div className="admin-booking-order-cell-center">{booking.roomCount}</div>
                    </td>
                    <td>
                      <div className="admin-booking-order-cell-primary">{booking.checkIn}</div>
                      <div className="admin-booking-order-cell-secondary">{booking.checkOut}</div>
                      <div className="admin-booking-order-cell-tertiary">({booking.nights} đêm)</div>
                    </td>
                    <td>
                      <div className="admin-booking-order-cell-amount">
                        {booking.totalAmount.toLocaleString('vi-VN')}đ
                      </div>
                    </td>
                    <td>
                      <div 
                        className="admin-booking-order-cell-payment" 
                        style={{ color: getPaymentColor(booking.paymentStatus) }}
                      >
                        {booking.paymentStatus}
                      </div>
                      {booking.remainingAmount > 0 && (
                        <div className="admin-booking-order-cell-tertiary">
                          Còn: {booking.remainingAmount.toLocaleString('vi-VN')}đ
                        </div>
                      )}
                    </td>
                    <td>
                      <span 
                        className="admin-booking-order-status-badge"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.statusText}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="admin-booking-order-action-btn"
                        onClick={() => handleViewDetail(booking)}
                      >
                        <img src={EyeIcon} alt="View" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <BookingOrderDetailModal 
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />
    </div>
  );
};

export default BookingOrderManagementPage;
