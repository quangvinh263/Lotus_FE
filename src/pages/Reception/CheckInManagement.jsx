import React, { useState } from 'react';
import './CheckInManagement.css';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import CheckInCard from '../../components/Reception/CheckInCard';
import RoomButton from '../../components/Reception/RoomButton';
import CheckInModal from '../../components/Reception/CheckInModal';
import SearchIcon from '../../assets/icons/SearchIcon.svg';

const CheckInManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sample data - replace with API calls
  const bookings = [
    {
      id: 1,
      guestName: 'Nguyễn Văn An',
      bookingCode: 'BK001',
      phone: '0901234567',
      email: 'an.nguyen@email.com',
      checkInDate: '2/11/2025',
      checkOutDate: '5/11/2025',
      status: 'confirmed',
      guestCount: 5, // 5 khách
      totalRooms: 2,
      roomsByType: {
        'Deluxe': 1,
        'Superior': 1
      }
    },
    {
      id: 2,
      guestName: 'Trần Thị Bình',
      bookingCode: 'BK002',
      phone: '0912345678',
      email: 'binh.tran@email.com',
      checkInDate: '2/11/2025',
      checkOutDate: '4/11/2025',
      status: 'pending',
      guestCount: 2, // 2 khách
      totalRooms: 1,
      roomsByType: {
        'Deluxe': 1
      }
    },
    {
      id: 3,
      guestName: 'Lê Minh Tuấn',
      bookingCode: 'BK003',
      phone: '0923456789',
      email: 'tuan.le@email.com',
      checkInDate: '2/11/2025',
      checkOutDate: '6/11/2025',
      status: 'confirmed',
      guestCount: 6, // 6 khách - test UI nhiều người
      totalRooms: 2,
      roomsByType: {
        'Suite': 1,
        'Deluxe': 1
      }
    },
    {
      id: 4,
      guestName: 'Phạm Thị Hương',
      bookingCode: 'BK004',
      phone: '0934567890',
      email: 'huong.pham@email.com',
      checkInDate: '2/11/2025',
      checkOutDate: '4/11/2025',
      status: 'confirmed',
      guestCount: 4, // 4 khách
      totalRooms: 2,
      roomsByType: {
        'Executive': 2
      }
    }
  ];

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

  const filteredBookings = bookings.filter(booking =>
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
            <div className="bookings-section">
              <div className="section-header">
                <h3>Tìm kiếm đơn đặt phòng</h3>
              </div>

              <div className="search-container">
                <input
                  type="text"
                  placeholder="Tìm theo mã đặt phòng, tên khách, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <img src={SearchIcon} alt="Search" className="search-icon" />
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
