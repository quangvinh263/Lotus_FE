import React, { useState, useEffect } from 'react';
import './CheckInManagement.css';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import CheckInCard from '../../components/Reception/CheckInCard';
import RoomButton from '../../components/Reception/RoomButton';
import CheckInModal from '../../components/Reception/CheckInModal';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import { getBookingsList } from '../../api/bookingApi';


const CheckInManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingsList, setBookingsList] = useState([]);
  
  const mapReservationStatus = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'checkedin', label: 'Đã check-in' },
    { key: 'completed', label: 'Đã hoàn thành' },
    { key: 'cancelled', label: 'Đã hủy' }
  ];

  // ✅ Thêm hàm helper
  const mapReservationStatusToKey = (status) => {
    const statusMap = {
      'Pending': 'pending',
      'Confirmed': 'confirmed',
      'CheckedIn': 'checkedin',
      'Completed': 'completed',
      'Cancelled': 'cancelled',
      'PartialCheckout': 'checkedin'
    };
    return statusMap[status] || 'pending';
  };

  // ✅ Thêm hàm helper
  const mapReservationStatusText = (status) => {
    const statusTextMap = {
      'Pending': 'Chờ xác nhận',
      'Confirmed': 'Đã xác nhận',
      'CheckedIn': 'Đã check-in',
      'Completed': 'Đã hoàn thành',
      'Cancelled': 'Đã hủy',
      'PartialCheckout': 'Đang check-out'
    };
    return statusTextMap[status] || 'Chờ xác nhận';
  };

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

  useEffect(() => {
    const fetchBookings = async () => {
      const result = await getBookingsList('Confirmed', '');
      if (result.success) {
        const details = result.data;
        console.log('🔍 Raw booking details from API:', details);
        
        // ✅ Map từng booking trong array
        const mappedBookings = details.map((detail, index) => ({
          id: index + 1,
          bookingCode: detail.reservationId,
          bookingDate: new Date(detail.reservationDate).toLocaleDateString('vi-VN'),
          guestName: detail.fullName,
          phone: detail.phone,
          email: detail.email || 'N/A',
          checkInDate: detail.checkInDate && detail.checkInDate !== '0001-01-01' 
            ? new Date(detail.checkInDate).toLocaleDateString('vi-VN') 
            : '-',
          checkOutDate: detail.checkOutDate && detail.checkOutDate !== '0001-01-01'
            ? new Date(detail.checkOutDate).toLocaleDateString('vi-VN')
            : '-',
          status: mapReservationStatusToKey(detail.statusReservation),
          statusText: mapReservationStatusText(detail.statusReservation),
          statusColor: getStatusColor(mapReservationStatusToKey(detail.statusReservation)),
          roomTypes: detail.typeDetails || [],
        }));

        console.log('✅ Mapped bookings:', mappedBookings);
        setBookingsList(mappedBookings);
      } else {
        console.error('❌ Failed to fetch bookings:', result.message);
      }
    };
    fetchBookings();
  }, []);


  const availableRooms = [
    { id: 1, number: '101', type: 'Superior', price: 1500000, status: 'available' },
    { id: 2, number: '102', type: 'Deluxe', price: 1800000, status: 'available' },
    { id: 3, number: '103', type: 'Superior', price: 1500000, status: 'available' },
    { id: 4, number: '104', type: 'Deluxe', price: 1800000, status: 'available' },
    { id: 5, number: '201', type: 'Executive', price: 2000000, status: 'available' },
    { id: 6, number: '202', type: 'Executive', price: 2000000, status: 'available' },
    { id: 7, number: '203', type: 'Deluxe', price: 1800000, status: 'available' },
    { id: 8, number: '301', type: 'Suite', price: 2500000, status: 'available' },
    { id: 9, number: '302', type: 'Suite', price: 2500000, status: 'available' },
    { id: 10, number: '303', type: 'Executive', price: 2000000, status: 'available' },
    { id: 11, number: '401', type: 'Suite', price: 2500000, status: 'available' },
    { id: 12, number: '402', type: 'Deluxe', price: 1800000, status: 'available' },
    { id: 13, number: '403', type: 'Superior', price: 1500000, status: 'available' },
    { id: 14, number: '501', type: 'Suite', price: 2500000, status: 'available' },
    { id: 15, number: '502', type: 'Executive', price: 2000000, status: 'available' },
  ];

  const handleCheckIn = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleConfirmCheckIn = (guestInfo, selectedRooms) => {
    console.log('Check-in confirmed:', { guestInfo, selectedRooms });
    // Add API call here
    setShowModal(false);
    setSelectedBooking(null);
  };

  const filteredBookings = bookingsList.filter(booking =>
    booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.phone.includes(searchTerm) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="checkin-management-page">
      <Sidebar activePage="checkin" />
      
      <div className="checkin-main-content">
        <TopBar />
        
        <div className="checkin-content">
          <div className="checkin-header">
            <div className="header-text">
              <h1>Quản lý Check-in</h1>
              <p>Tìm kiếm đơn đặt phòng và xác nhận check-in cho khách</p>
            </div>
          </div>

          <div className="checkin-container">
            {/* Bookings List */}
            <div className="checkin-bookings-section">
              <div className="section-header">
                <h3>Tìm kiếm đơn đặt phòng</h3>
              </div>

              <div className="checkin-search-container">
                <input
                  type="text"
                  placeholder="Tìm theo mã đặt phòng, tên khách, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="checkin-search-input"
                />
                <img src={SearchIcon} alt="Search" className="checkin-search-icon" />
              </div>

              <div className="bookings-list">
                {filteredBookings.map(booking => (
                  <div key={booking.id} onClick={() => handleCheckIn(booking)}>
                    <CheckInCard booking={booking} />
                  </div>
                ))}
              </div>
            </div>

            {/* Available Rooms */}
            <div className="checkin-rooms-section">
              <div className="section-header">
                <h3>Phòng trống</h3>
              </div>

              <div className="checkin-rooms-grid">
                {availableRooms.map(room => (
                  <RoomButton
                    key={room.id}
                    room={room}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Modal */}
      {showModal && selectedBooking && (
        <CheckInModal
          booking={selectedBooking}
          rooms={availableRooms}
          onClose={() => {
            setShowModal(false);
            setSelectedBooking(null);
          }}
          onConfirm={handleConfirmCheckIn}
        />
      )}
    </div>
  );
};

export default CheckInManagement;
