import React, { useState, useEffect } from 'react';
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

  // Sample checkout data - match with DB schema
  const initialCheckouts = [
    {
      reservationId: 1, // ID từ bảng Reservations
      reservationCode: 'BK001',
      customerId: 1,
      customerName: 'Nguyễn Văn An',
      phone: '0901234567',
      checkInDate: '31/10/2025',
      checkOutDate: '3/11/2025',
      status: 'CheckedIn', // CheckedIn, CheckedOut, PartialCheckout
      totalAmount: 15250000, // Tổng tiền toàn bộ reservation
      isPaid: false, // Đã thanh toán chưa
      reservationDetails: [ // Từ bảng ReservationDetails
        {
          reservationDetailId: 1,
          roomId: 201,
          roomNumber: '201',
          roomType: 'Deluxe Room',
          pricePerNight: 1800000,
          nights: 3,
          checkInDate: '31/10/2025',
          checkOutDate: '3/11/2025',
          actualCheckOutDate: null, // Ngày check-out thực tế (null = chưa check-out)
          services: [
            { serviceId: 1, name: 'Giặt ủi', price: 150000, quantity: 1 },
            { serviceId: 2, name: 'Hồ bơi', price: 200000, quantity: 1 }
          ],
          subtotal: 5750000 // Tiền phòng + dịch vụ
        },
        {
          reservationDetailId: 2,
          roomId: 202,
          roomNumber: '202',
          roomType: 'Deluxe Room',
          pricePerNight: 1800000,
          nights: 3,
          checkInDate: '31/10/2025',
          checkOutDate: '3/11/2025',
          actualCheckOutDate: null,
          services: [
            { serviceId: 3, name: 'Spa', price: 500000, quantity: 1 }
          ],
          subtotal: 5900000
        },
        {
          reservationDetailId: 3,
          roomId: 101,
          roomNumber: '101',
          roomType: 'Superior Room',
          pricePerNight: 1200000,
          nights: 3,
          checkInDate: '31/10/2025',
          checkOutDate: '3/11/2025',
          actualCheckOutDate: null,
          services: [],
          subtotal: 3600000
        }
      ]
    },
    {
      reservationId: 2,
      reservationCode: 'BK002',
      customerId: 2,
      customerName: 'Trần Thị Bình',
      phone: '0912345678',
      checkInDate: '1/11/2025',
      checkOutDate: '2/11/2025',
      status: 'CheckedIn',
      totalAmount: 2400000,
      isPaid: false,
      reservationDetails: [
        {
          reservationDetailId: 4,
          roomId: 301,
          roomNumber: '301',
          roomType: 'Executive Room',
          pricePerNight: 2400000,
          nights: 1,
          checkInDate: '1/11/2025',
          checkOutDate: '2/11/2025',
          actualCheckOutDate: null,
          services: [],
          subtotal: 2400000
        }
      ]
    },
    {
      reservationId: 3,
      reservationCode: 'BK003',
      customerId: 3,
      customerName: 'Lê Hoàng Nam',
      phone: '0923456789',
      checkInDate: '1/11/2025',
      checkOutDate: '4/11/2025',
      status: 'CheckedIn',
      totalAmount: 11600000,
      isPaid: false,
      reservationDetails: [
        {
          reservationDetailId: 5,
          roomId: 401,
          roomNumber: '401',
          roomType: 'Grand Suite',
          pricePerNight: 3500000,
          nights: 3,
          checkInDate: '1/11/2025',
          checkOutDate: '4/11/2025',
          actualCheckOutDate: null,
          services: [
            { serviceId: 3, name: 'Spa', price: 600000, quantity: 1 },
            { serviceId: 1, name: 'Giặt ủi', price: 300000, quantity: 1 },
            { serviceId: 2, name: 'Hồ bơi', price: 200000, quantity: 1 }
          ],
          subtotal: 11600000
        }
      ]
    }
  ];

  // State to manage checkouts - initialized with sample data
  const [checkouts, setCheckouts] = useState(initialCheckouts);

  const handleCheckOutAll = (reservation) => {
    setSelectedBooking(reservation);
    // Chọn tất cả các phòng (tạo array [0, 1, 2, ...])
    setPreselectedRoomIndices(reservation.reservationDetails.map((_, index) => index));
    setIsModalOpen(true);
  };

  const handleRoomClick = (reservation, roomIndex) => {
    setSelectedBooking(reservation);
    setPreselectedRoomIndices([roomIndex]);
    setIsModalOpen(true);
  };

  const handleConfirmCheckOut = async (selectedRoomDetailsData) => {
    try {
      const detailIds = selectedRoomDetailsData.map(detail => detail.reservationDetailId);
      
      console.log('📤 Calling API to check-out rooms:', {
        reservationId: selectedBooking.reservationId,
        reservationDetailIds: detailIds
      });
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/reservations/checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     reservationId: selectedBooking.reservationId,
      //     reservationDetailIds: detailIds,
      //     checkOutDate: new Date().toISOString()
      //   })
      // });
      // 
      // const result = await response.json();
      // 
      // if (result.isFullyCheckedOut) {
      //   console.log('✅ All rooms checked out - Payment created:', result.payment);
      // } else {
      //   console.log('⚠️ Partial checkout - Remaining rooms:', result.remainingRooms);
      // }
      
      // MOCK: Simulate API response
      const remainingDetails = selectedBooking.reservationDetails.filter(
        detail => !detailIds.includes(detail.reservationDetailId)
      );
      
      if (remainingDetails.length === 0) {
        console.log('✅ Backend will: Update all ReservationDetails, Create Payment, Update Reservation status to CheckedOut');
      } else {
        console.log('⚠️ Backend will: Update checked-out ReservationDetails, Update Reservation status to PartialCheckout');
      }
      
      // Sau khi API success, cập nhật UI
      setCheckouts(prevCheckouts => {
        return prevCheckouts.map(reservation => {
          if (reservation.reservationId === selectedBooking.reservationId) {
            // Nếu check-out hết → xóa khỏi danh sách
            if (remainingDetails.length === 0) {
              return null;
            }
            // Nếu còn phòng → giữ lại những phòng chưa check-out
            return {
              ...reservation,
              reservationDetails: remainingDetails,
              status: 'PartialCheckout'
            };
          }
          return reservation;
        }).filter(Boolean);
      });
      
      setIsModalOpen(false);
      setSelectedBooking(null);
      setPreselectedRoomIndices([]);
      
      // TODO: Có thể fetch lại data từ server để đảm bảo đồng bộ
      // await fetchCheckoutReservations();
      
    } catch (error) {
      console.error('❌ Error during checkout:', error);
      alert('Có lỗi xảy ra khi check-out. Vui lòng thử lại.');
    }
  };

  const filteredCheckouts = checkouts.filter(reservation => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    if (searchType === 'booking') {
      return (
        reservation.reservationCode.toLowerCase().includes(query) ||
        reservation.customerName.toLowerCase().includes(query) ||
        reservation.phone.includes(query)
      );
    } else {
      return reservation.reservationDetails.some(detail => 
        detail.roomNumber.toLowerCase().includes(query)
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
              {filteredCheckouts.map(reservation => (
                <CheckOutCard
                  key={reservation.reservationId}
                  bookingId={reservation.reservationCode}
                  guestName={reservation.customerName}
                  phone={reservation.phone}
                  checkInDate={reservation.checkInDate}
                  checkOutDate={reservation.checkOutDate}
                  nights={reservation.reservationDetails[0]?.nights || 0}
                  rooms={reservation.reservationDetails}
                  onCheckOutAll={() => handleCheckOutAll(reservation)}
                  onRoomClick={(roomIndex) => handleRoomClick(reservation, roomIndex)}
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
