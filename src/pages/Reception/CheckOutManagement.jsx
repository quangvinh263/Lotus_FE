import React, { useState } from 'react';
import './CheckOutManagement.css';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import CheckOutCard from '../../components/Reception/CheckOutCard';
import CheckOutModal from '../../components/Reception/CheckOutModal';
import SearchIcon from '../../assets/icons/SearchIcon.svg';

const CheckOutManagement = () => {
  const [searchType, setSearchType] = useState('booking'); // 'booking' or 'room'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [preselectedRoomIndices, setPreselectedRoomIndices] = useState([]);

  // Sample checkout data
  const checkouts = [
    {
      id: 1,
      bookingId: 'BK001',
      guestName: 'Nguyễn Văn An',
      phone: '0901234567',
      checkInDate: '31/10/2025',
      checkOutDate: '3/11/2025',
      nights: 3,
      rooms: [
        {
          number: '201',
          type: 'Deluxe Room',
          pricePerNight: 1800000,
          nights: 3,
          services: [
            { name: 'Giặt ủi', price: 150000 },
            { name: 'Hồ bơi', price: 200000 }
          ],
          serviceCharge: 350000,
          total: 5750000
        },
        {
          number: '202',
          type: 'Deluxe Room',
          pricePerNight: 1800000,
          nights: 3,
          services: [
            { name: 'Spa', price: 500000 }
          ],
          serviceCharge: 500000,
          total: 5900000
        },
        {
          number: '101',
          type: 'Superior Room',
          pricePerNight: 1200000,
          nights: 3,
          services: [],
          serviceCharge: 0,
          total: 3600000
        }
      ]
    },
    {
      id: 2,
      bookingId: 'BK002',
      guestName: 'Trần Thị Bình',
      phone: '0912345678',
      checkInDate: '1/11/2025',
      checkOutDate: '2/11/2025',
      nights: 1,
      rooms: [
        {
          number: '301',
          type: 'Executive Room',
          pricePerNight: 2400000,
          nights: 1,
          services: [],
          serviceCharge: 0,
          total: 2400000
        }
      ]
    },
    {
      id: 3,
      bookingId: 'BK003',
      guestName: 'Lê Hoàng Nam',
      phone: '0923456789',
      checkInDate: '1/11/2025',
      checkOutDate: '4/11/2025',
      nights: 3,
      rooms: [
        {
          number: '401',
          type: 'Grand Suite',
          pricePerNight: 3500000,
          nights: 3,
          services: [
            { name: 'Spa', price: 600000 },
            { name: 'Giặt ủi', price: 300000 },
            { name: 'Hồ bơi', price: 200000 }
          ],
          serviceCharge: 1100000,
          total: 11600000
        }
      ]
    }
  ];

  const handleCheckOutAll = (checkout) => {
    setSelectedBooking(checkout);
    // Chọn tất cả các phòng (tạo array [0, 1, 2, ...])
    setPreselectedRoomIndices(checkout.rooms.map((_, index) => index));
    setIsModalOpen(true);
  };

  const handleRoomClick = (checkout, roomIndex) => {
    setSelectedBooking(checkout);
    setPreselectedRoomIndices([roomIndex]);
    setIsModalOpen(true);
  };

  const handleConfirmCheckOut = (selectedRooms) => {
    console.log('Checking out rooms:', selectedRooms);
    // TODO: Implement API call to process check-out
    setIsModalOpen(false);
    setSelectedBooking(null);
    setPreselectedRoomIndices([]);
  };

  const filteredCheckouts = checkouts.filter(checkout => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    if (searchType === 'booking') {
      return (
        checkout.bookingId.toLowerCase().includes(query) ||
        checkout.guestName.toLowerCase().includes(query) ||
        checkout.phone.includes(query)
      );
    } else {
      return checkout.rooms.some(room => 
        room.number.toLowerCase().includes(query)
      );
    }
  });

  return (
    <div className="checkout-management">
      <Sidebar variant="checkout" />
      <div className="checkout-main-content">
        <TopBar />
        
        <div className="checkout-content-area">
          <div className="checkout-header">
            <h1 className="checkout-title">Quản lý Check-out</h1>
            <p className="checkout-subtitle">Tìm kiếm khách đang ở và tạo hóa đơn check-out</p>
          </div>

          <div className="checkout-search-section">
            <h2 className="checkout-search-title">Tìm kiếm</h2>
            
            <div className="checkout-search-tabs">
              <button 
                className={`checkout-tab ${searchType === 'booking' ? 'active' : ''}`}
                onClick={() => setSearchType('booking')}
              >
                Tìm theo đơn đặt phòng
              </button>
              <button 
                className={`checkout-tab ${searchType === 'room' ? 'active' : ''}`}
                onClick={() => setSearchType('room')}
              >
                Tìm theo số phòng
              </button>
            </div>

            <div className="checkout-search-input-wrapper">
              <div className="checkout-search-icon">
                <img src={SearchIcon} alt="Search" />
              </div>
              <input
                type="text"
                className="checkout-search-input"
                placeholder={searchType === 'booking' ? 'Tìm theo mã đơn, tên khách, SĐT...' : 'Tìm theo số phòng'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="checkout-results">
              {filteredCheckouts.map(checkout => (
                <CheckOutCard
                  key={checkout.id}
                  bookingId={checkout.bookingId}
                  guestName={checkout.guestName}
                  phone={checkout.phone}
                  checkInDate={checkout.checkInDate}
                  checkOutDate={checkout.checkOutDate}
                  nights={checkout.nights}
                  rooms={checkout.rooms}
                  onCheckOutAll={() => handleCheckOutAll(checkout)}
                  onRoomClick={(roomIndex) => handleRoomClick(checkout, roomIndex)}
                />
              ))}
              
              {filteredCheckouts.length === 0 && (
                <div className="checkout-no-results">
                  <p>Không tìm thấy kết quả phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Check-out Modal */}
      <CheckOutModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
          setPreselectedRoomIndices([]);
        }}
        bookingData={selectedBooking}
        preselectedRooms={preselectedRoomIndices}
        onConfirm={handleConfirmCheckOut}
      />
    </div>
  );
};

export default CheckOutManagement;
