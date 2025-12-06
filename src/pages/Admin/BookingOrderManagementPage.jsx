import React, { useState, useEffect, useRef } from 'react';
import '../../styles/Admin/BookingOrderManagementPage.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import BookingOrderDetailModal from '../../components/Admin/BookingOrderDetailModal';
import PaymentFilterPopup from '../../components/Admin/PaymentFilterPopup';
import { getBookingsStatistic, getBookingsList, getBookingDetail } from '../../api/bookingApi';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import FilterIcon from '../../assets/icons/FilterIcon.svg';
import EyeIcon from '../../assets/icons/EyeIcon.svg';

const BookingOrderManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentFilter, setShowPaymentFilter] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const filterButtonRef = useRef(null);
  const [bookingList, setBookingList] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  useEffect(() => {
    fetchStatistics();
    fetchBookings();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [activeFilter, searchTerm]);

  const fetchStatistics = async () => {
    setIsLoading(true);
    const result = await getBookingsStatistic();
    
    if (result.success) {
      const data = result.data;
      console.log('Raw statistics from backend:', data);
      
      // Map từ backend keys sang frontend
      const mappedStats = {
        'All': data.All || 0,
        'Pending': data.Pending || 0,
        'Confirmed': data.Confirmed || 0,
        'InHouse': data.InHouse || 0,
        'Completed': data.Completed || 0,
        'Cancelled': data.Cancelled || 0
      };
      
      setStatistics(mappedStats);
      console.log('Mapped statistics:', mappedStats);
    } else {
      console.warn('Statistics not available:', result.message);
      // Set default statistics nếu chưa có data
      setStatistics({
        'All': 0,
        'Pending': 0,
        'Confirmed': 0,
        'InHouse': 0,
        'Completed': 0,
        'Cancelled': 0
      });
    }
    setIsLoading(false);
  };

  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    // Map frontend filter key sang backend status value
    const statusFilterValue = activeFilter === 'all' ? null : mapFilterKeyToBackendStatus(activeFilter);
    const result = await getBookingsList(statusFilterValue, searchTerm);
    
    if (result.success && Array.isArray(result.data)) {
      const mappedBookings = result.data.map(booking => ({
        id: booking.reservationId,
        bookingDate: new Date(booking.reservationDate).toLocaleDateString('vi-VN'),
        customerName: booking.fullName,
        phone: booking.phone,
        roomCount: booking.roomCount,
        checkIn: booking.checkInDate !== '0001-01-01' ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : '-',
        checkOut: booking.checkOutDate !== '0001-01-01' ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : '-',
        nights: booking.durationNights,
        totalAmount: booking.totalAmount,
        paymentStatus: mapPaymentStatus(booking.statusPayment),
        remainingAmount: booking.totalDue,
        status: mapReservationStatusToKey(booking.statusReservation),
        statusText: mapReservationStatus(booking.statusReservation)
      }));
      
      setBookingList(mappedBookings);
      console.log('Mapped bookings:', mappedBookings);
    } else {
      console.warn('Bookings not available:', result.message);
      setBookingList([]);
    }
    setIsLoadingBookings(false);
  };

  const mapPaymentStatus = (status) => {
    const statusMap = {
      'Paid': 'Đã thanh toán',
      'Deposited': 'Đã đặt cọc',
      'PaidAmount': 'Đã thanh toán một phần',
      'Unpaid': 'Chưa thanh toán',
      'NotDeposited': 'Chưa đặt cọc'
    };
    return statusMap[status] || status;
  };

  const mapReservationStatus = (status) => {
    const statusMap = {
      'Pending': 'Chờ xác nhận',
      'Confirmed': 'Đã xác nhận',
      'InHouse': 'Đã check-in',
      'Completed': 'Đã hoàn thành',
      'Cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const mapReservationStatusToKey = (status) => {
    const statusMap = {
      'Pending': 'pending',
      'Confirmed': 'confirmed',
      'InHouse': 'checkedin',
      'Completed': 'completed',
      'Cancelled': 'cancelled'
    };
    return statusMap[status] || 'pending';
  };

  const mapFilterKeyToBackendStatus = (filterKey) => {
    const keyMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'checkedin': 'InHouse',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return keyMap[filterKey] || null;
  };

  const stats = statistics ? [
    { label: 'Tổng đơn', value: statistics.All || 0, color: '#133E87' },
    { label: 'Chờ xác nhận', value: statistics.Pending || 0, color: '#F0B100' },
    { label: 'Đã xác nhận', value: statistics.Confirmed || 0, color: '#133E87' },
    { label: 'Đã check-in', value: statistics.InHouse || 0, color: '#00A63E' },
    { label: 'Hoàn thành', value: statistics.Completed || 0, color: '#4A5565' },
    { label: 'Đã hủy', value: statistics.Cancelled || 0, color: '#FB2C36' }
  ] : [
    { label: 'Tổng đơn', value: 0, color: '#133E87' },
    { label: 'Chờ xác nhận', value: 0, color: '#F0B100' },
    { label: 'Đã xác nhận', value: 0, color: '#133E87' },
    { label: 'Đã check-in', value: 0, color: '#00A63E' },
    { label: 'Hoàn thành', value: 0, color: '#4A5565' },
    { label: 'Đã hủy', value: 0, color: '#FB2C36' }
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

  const handleViewDetail = async (booking) => {
    // Fetch chi tiết từ API
    const result = await getBookingDetail(booking.id);
    
    if (result.success) {
      const detail = result.data;
      
      console.log('🔍 Raw booking detail from API:', detail);
      
      // Kiểm tra nếu backend trả về array hoặc có thuộc tính lồng nhau
      const detailData = Array.isArray(detail) ? detail[0] : detail;
      
      // Map data từ backend - ưu tiên data có đầy đủ thông tin
      const mappedDetail = {
        id: detailData.reservationId,
        bookingDate: new Date(detailData.reservationDate).toLocaleDateString('vi-VN'),
        customerName: detailData.fullName,
        phone: detailData.phone,
        email: detailData.email || 'N/A',
        roomCount: detailData.roomCount || 0,
        checkIn: detailData.checkInDate && detailData.checkInDate !== '0001-01-01' 
          ? new Date(detailData.checkInDate).toLocaleDateString('vi-VN') 
          : '-',
        checkOut: detailData.checkOutDate && detailData.checkOutDate !== '0001-01-01'
          ? new Date(detailData.checkOutDate).toLocaleDateString('vi-VN')
          : '-',
        nights: detailData.durationNights || 0,
        countPeople: detailData.countPeople || 0,
        totalAmount: detailData.totalAmount || 0,
        totalRoom: detailData.totalRoom || 0,
        totalService: detailData.totalService || 0,
        totalPaid: detailData.totalPaid || 0,
        paidAmount: detailData.paidAmount || 0,
        remainingAmount: detailData.totalDue || 0,
        paymentStatus: mapPaymentStatus(detailData.statusPayment),
        status: mapReservationStatusToKey(detailData.statusReservation),
        statusText: mapReservationStatus(detailData.statusReservation),
        statusColor: getStatusColor(mapReservationStatusToKey(detailData.statusReservation)),
        paymentStatusColor: getPaymentColor(mapPaymentStatus(detailData.statusPayment)),
        roomTypes: detailData.typeDetails || [],
        depositAmount: detailData.depositAmount || 0
      };
      
      setSelectedBooking(mappedDetail);
      console.log('📝 Mapped booking detail:', mappedDetail);
    } else {
      console.error('❌ Failed to fetch booking detail:', result.message);
      // Fallback: sử dụng data từ list
      setSelectedBooking({
        ...booking,
        statusColor: getStatusColor(booking.status),
        paymentStatusColor: getPaymentColor(booking.paymentStatus),
        depositAmount: booking.depositAmount || 0,
        email: 'N/A',
        countPeople: 0,
        totalRoom: 0,
        totalService: 0,
        totalPaid: 0,
        roomTypes: []
      });
    }
    
    setShowDetailModal(true);
  };

  const handlePaymentFilterApply = (selectedPaymentStatus) => {
    setPaymentFilter(selectedPaymentStatus);
  };

  const getPaymentFilterKey = (paymentStatus) => {
    if (paymentStatus === 'Đã thanh toán') return 'paid';
    if (paymentStatus === 'Đã đặt cọc') return 'deposited';
    if (paymentStatus === 'Chưa thanh toán' || paymentStatus === 'Chưa đặt cọc') return 'unpaid';
    return 'all';
  };

  const filteredBookings = bookingList.filter(booking => {
    // Double-check: Đảm bảo filter status khớp với activeFilter
    if (activeFilter !== 'all' && booking.status !== activeFilter) {
      return false;
    }
    
    // Filter theo payment status
    if (paymentFilter === 'all') return true;
    const bookingPaymentKey = getPaymentFilterKey(booking.paymentStatus);
    return bookingPaymentKey === paymentFilter;
  });

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
            {isLoading ? (
              <div className="admin-booking-order-loading">Đang tải thống kê...</div>
            ) : (
              stats.map((stat, index) => (
                <div key={index} className="admin-booking-order-stat-card">
                  <p className="admin-booking-order-stat-label">{stat.label}</p>
                  <h2 className="admin-booking-order-stat-value" style={{ color: stat.color }}>
                    {stat.value}
                  </h2>
                </div>
              ))
            )}
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
            <button 
              ref={filterButtonRef}
              className="admin-booking-order-filter-action-btn"
              onClick={() => setShowPaymentFilter(!showPaymentFilter)}
            >
              <img src={FilterIcon} alt="Filter" className="admin-booking-order-filter-icon" />
              <span>Lọc</span>
              {paymentFilter !== 'all' && <span className="filter-badge"></span>}
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
                {isLoadingBookings ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                      Đang tải danh sách đơn đặt phòng...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px' }}>
                      Không tìm thấy đơn đặt phòng nào
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
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
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Filter Popup */}
      <PaymentFilterPopup
        isOpen={showPaymentFilter}
        onClose={() => setShowPaymentFilter(false)}
        onApply={handlePaymentFilterApply}
        buttonRef={filterButtonRef}
      />

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
