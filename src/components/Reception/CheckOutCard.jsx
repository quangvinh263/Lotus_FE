import React from 'react';
import './CheckOutCard.css';
import HouseIcon from '../../assets/icons/HouseIcon.svg';
import PhoneIcon from '../../assets/icons/PhoneIcon.svg';
import CalendarIcon from '../../assets/icons/CalenderIcon.svg';

const CheckOutCard = ({ 
  bookingId = 'BK001',
  guestName = 'Nguyễn Văn An',
  phone = '0901234567',
  checkInDate = '31/10/2025',
  checkOutDate = '3/11/2025',
  nights = 3,
  rooms = [],
  onCheckOutAll = () => {},
  onRoomClick = () => {}
}) => {
  return (
    <div className="checkout-card">
      <div className="checkout-card-header">
        <div className="checkout-guest-info">
          <div className="checkout-name-badge">
            <h3 className="checkout-guest-name">{guestName}</h3>
            <div className="checkout-booking-badge">{bookingId}</div>
          </div>
          <div className="checkout-contact-info">
            <p className="checkout-phone">
              <img src={PhoneIcon} alt="Phone" className="checkout-info-icon" />
              {phone}
            </p>
            <p className="checkout-dates">
              <img src={CalendarIcon} alt="Calendar" className="checkout-info-icon" />
              {checkInDate} - {checkOutDate} ({nights} đêm)
            </p>
          </div>
        </div>
        <button className="checkout-btn-all" onClick={onCheckOutAll}>
          Check-out toàn bộ
        </button>
      </div>

      <div className="checkout-divider"></div>

      <div className="checkout-rooms-section">
        <p className="checkout-rooms-label">Phòng đang ở:</p>
        <div className="checkout-rooms-list">
          {rooms.map((room, index) => (
            <div 
              key={index} 
              className="checkout-room-item" 
              onClick={() => onRoomClick(index)}
              style={{ cursor: 'pointer' }}
            >
              <div className="checkout-room-header">
                <div className="checkout-room-info">
                  <div className="checkout-room-icon">
                    <img src={HouseIcon} alt="Room" />
                  </div>
                  <span className="checkout-room-number">{room.number}</span>
                </div>
                <div className="checkout-room-type-badge">{room.type}</div>
              </div>
              <div className="checkout-room-details">
                <p className="checkout-room-detail">Phòng: {room.pricePerNight.toLocaleString()} × {room.nights} đêm</p>
                {room.serviceCharge > 0 && (
                  <p className="checkout-room-detail">Dịch vụ: {room.serviceCharge.toLocaleString()} VNĐ</p>
                )}
                <div className="checkout-room-total">
                  <p className="checkout-total-text">Tổng: {room.total.toLocaleString()} VNĐ</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckOutCard;
