import React, { useState } from 'react';
import './CheckInModal.css';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import CheckInIcon from '../../assets/icons/CheckInIcon.svg';
import GuestInfoForm from './GuestInfoForm';
import RoomGuestAssignment from './RoomGuestAssignment';

const CheckInModal = ({ booking, rooms, onClose, onConfirm }) => {
  // Khởi tạo danh sách khách với người đại diện - Chỉ cần họ tên, CCCD, giới tính
  const [guests, setGuests] = useState([
    {
      fullName: booking.guestName || '',
      idNumber: '',
      gender: 'male',
      isPrimary: true
    }
  ]);

  const [selectedRooms, setSelectedRooms] = useState({});
  const [roomAssignments, setRoomAssignments] = useState({}); // { roomId: [guestIndex1, guestIndex2] }
  const [searchTerm, setSearchTerm] = useState('');

  // Group rooms by type - chỉ lấy những loại phòng có trong booking
  const roomsByType = rooms.reduce((acc, room) => {
    // Chỉ thêm phòng nếu loại phòng có trong booking.roomsByType
    if (booking.roomsByType && booking.roomsByType[room.type]) {
      if (!acc[room.type]) {
        acc[room.type] = [];
      }
      acc[room.type].push(room);
    }
    return acc;
  }, {});

  const handleRoomSelect = (roomType, room) => {
    setSelectedRooms(prev => {
      const typeRooms = prev[roomType] || [];
      const isSelected = typeRooms.find(r => r.id === room.id);
      
      if (isSelected) {
        return {
          ...prev,
          [roomType]: typeRooms.filter(r => r.id !== room.id)
        };
      } else {
        return {
          ...prev,
          [roomType]: [...typeRooms, room]
        };
      }
    });
  };

  const getTotalSelectedRooms = () => {
    return Object.values(selectedRooms).reduce((total, rooms) => total + rooms.length, 0);
  };

  const getTotalAssignedGuests = () => {
    return new Set(Object.values(roomAssignments).flat()).size;
  };

  const getTypeColor = (type) => {
    const colors = {
      'Superior': '#608BC1',
      'Deluxe': '#608BC1',
      'Executive': '#608BC1',
      'Suite': '#608BC1'
    };
    return colors[type] || '#608BC1';
  };

  // Map room type to max guests per room (based on booking data or default)
  const getMaxGuestsPerRoom = () => {
    const maxGuests = {};
    if (booking.roomsByType) {
      Object.keys(booking.roomsByType).forEach(type => {
        // You can customize this based on room type
        switch (type) {
          case 'Superior':
            maxGuests[type] = 2;
            break;
          case 'Deluxe':
            maxGuests[type] = 3;
            break;
          case 'Executive':
            maxGuests[type] = 3;
            break;
          case 'Suite':
            maxGuests[type] = 4;
            break;
          default:
            maxGuests[type] = 2;
        }
      });
    }
    return maxGuests;
  };

  // Tính tổng sức chứa của tất cả các phòng trong booking
  const getTotalRoomCapacity = () => {
    const maxGuestsPerRoom = getMaxGuestsPerRoom();
    let totalCapacity = 0;
    
    if (booking.roomsByType) {
      Object.entries(booking.roomsByType).forEach(([roomType, count]) => {
        const capacityPerRoom = maxGuestsPerRoom[roomType] || 2;
        totalCapacity += capacityPerRoom * count;
      });
    }
    
    return totalCapacity;
  };

  return (
    <div className="checkin-modal-overlay" onClick={onClose}>
      <div className="checkin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkin-close-button" onClick={onClose}>
          <span>&times;</span>
        </button>

        <div className="checkin-modal-header">
          <h2>Xác nhận Check-in</h2>
          <br />
          <p>
            Vui lòng xác nhận thông tin khách và chọn phòng<br/>
            <small style={{ color: '#6B7280', fontSize: '12px' }}>
              Đã đặt: {booking.guestCount || 0} khách • Sức chứa tối đa: {getTotalRoomCapacity()} khách
            </small>
          </p>
        </div>

        <div className="checkin-modal-content">
          {/* Guest Information - Sử dụng GuestInfoForm */}
          <div className="guest-form">
            <GuestInfoForm
              guests={guests}
              onGuestsChange={setGuests}
              totalGuests={getTotalRoomCapacity()} // Tổng sức chứa của các phòng đã book
              showIdNumber={true}
            />
          </div>

          {/* Room Assignment */}
          <div className="room-assignment">
            <div className="assignment-header">
              <label>Gán phòng cho đơn đặt *</label>
              <div className="rooms-badge">
                {getTotalSelectedRooms()}/{booking.totalRooms} phòng đã gán
              </div>
            </div>

            {/* Room Selection by Type */}
            {Object.entries(roomsByType).map(([roomType, typeRooms]) => (
              <div key={roomType} className="room-type-section">
                <div className="room-type-header">
                  <div className="room-type-info">
                    <span className="checkin-room-type-badge" style={{ background: getTypeColor(roomType) }}>
                      {roomType} Room
                    </span>
                    <span className="room-need">Cần {booking.roomsByType[roomType] || 0} phòng</span>
                  </div>
                  <span className="rooms-selected">
                    Đã chọn: {(selectedRooms[roomType] || []).length}/{booking.roomsByType[roomType] || 0}
                  </span>
                </div>

                <div className="room-selection-area">
                  <div className="search-header">
                    <p>Chọn phòng trống ({typeRooms.length} phòng):</p>
                  </div>

                  <div className="search-wrapper">
                    <input
                      type="text"
                      placeholder="Tìm số phòng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={SearchIcon} alt="Search" className="search-icon" />
                  </div>

                  <div className="checkin-modal-rooms-grid">
                    {typeRooms
                      .filter(room => room.number.includes(searchTerm))
                      .map(room => {
                        const isSelected = (selectedRooms[roomType] || []).find(r => r.id === room.id);
                        return (
                          <button
                            key={room.id}
                            className={`checkin-room-select-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleRoomSelect(roomType, room)}
                          >
                            <span className="checkin-room-number-text">{room.number}</span>
                            <span className="checkin-room-price-text">
                              {room.price.toLocaleString('vi-VN')} VNĐ
                            </span>
                          </button>
                        );
                      })}
                  </div>

                  {/* Selected Rooms Display */}
                  {(selectedRooms[roomType] || []).length > 0 && (
                    <div className="selected-rooms-display">
                      <p>Phòng đã chọn:</p>
                      <div className="selected-rooms-badges">
                        {(selectedRooms[roomType] || []).map(room => (
                          <span key={room.id} className="selected-room-badge">
                            {room.number}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Room-Guest Assignment - Gán khách vào từng phòng */}
          {getTotalSelectedRooms() > 0 && guests.length > 0 && (
            <div className="room-guest-assignment-section">
              <RoomGuestAssignment
                selectedRooms={selectedRooms}
                guests={guests}
                onAssignmentChange={setRoomAssignments}
                maxGuestsPerRoom={getMaxGuestsPerRoom()}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="checkin-modal-footer">
          <button className="checkin-btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            className="checkin-btn-confirm"
            disabled={
              getTotalSelectedRooms() !== booking.totalRooms ||
              guests.length === 0 ||
              guests.some(g => !g.fullName || !g.idNumber || !g.gender) || // Validate: tên, CMND, giới tính
              getTotalAssignedGuests() !== guests.length // Tất cả khách phải được gán phòng
            }
            onClick={() => onConfirm({ 
              guests, 
              primaryGuest: guests[0],
              roomAssignments // Thông tin khách nào ở phòng nào
            }, selectedRooms)}
          >
            <img src={CheckInIcon} alt="Check-in" />
            Xác nhận Check-in ({getTotalSelectedRooms()}/{booking.totalRooms})
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
