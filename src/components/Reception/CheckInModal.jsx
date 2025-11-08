import React, { useState } from 'react';
import './CheckInModal.css';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import PhoneIcon from '../../assets/icons/PhoneIcon.svg';
import MailIcon from '../../assets/icons/MailIcon.svg';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import CheckInIcon from '../../assets/icons/CheckInIcon.svg';

const CheckInModal = ({ booking, rooms, onClose, onConfirm }) => {
  const [guestInfo, setGuestInfo] = useState({
    name: booking.guestName || '',
    phone: booking.phone || '',
    email: booking.email || ''
  });

  const [selectedRooms, setSelectedRooms] = useState({});
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

  const getTypeColor = (type) => {
    const colors = {
      'Superior': '#608BC1',
      'Deluxe': '#608BC1',
      'Executive': '#608BC1',
      'Suite': '#608BC1'
    };
    return colors[type] || '#608BC1';
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
          <p>Vui lòng xác nhận thông tin khách và chọn phòng</p>
        </div>

        <div className="checkin-modal-content">
          {/* Guest Information */}
          <div className="guest-form">
            <div className="form-group">
              <label>Họ tên khách *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                />
                <img src={PersonIcon} alt="Person" className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label>Số điện thoại *</label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                />
                <img src={PhoneIcon} alt="Phone" className="input-icon" />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                />
                <img src={MailIcon} alt="Email" className="input-icon" />
              </div>
            </div>
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

                  <div className="rooms-grid">
                    {typeRooms
                      .filter(room => room.number.includes(searchTerm))
                      .map(room => {
                        const isSelected = (selectedRooms[roomType] || []).find(r => r.id === room.id);
                        return (
                          <button
                            key={room.id}
                            className={`room-select-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleRoomSelect(roomType, room)}
                          >
                            <span className="room-number-text">{room.number}</span>
                            <span className="room-price-text">
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
        </div>

        {/* Modal Footer */}
        <div className="checkin-modal-footer">
          <button className="checkin-btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            className="checkin-btn-confirm"
            disabled={getTotalSelectedRooms() !== booking.totalRooms}
            onClick={() => onConfirm(guestInfo, selectedRooms)}
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
