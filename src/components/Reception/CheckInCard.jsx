import React from 'react';
import './CheckInCard.css';
import PhoneIcon from '../../assets/icons/PhoneIcon.svg';
import MailIcon from '../../assets/icons/MailIcon.svg';
import CalendarIcon from '../../assets/icons/CalenderIcon.svg';
import PersonIcon from '../../assets/icons/PersonIcon.svg';

const CheckInCard = ({ booking, onCheckIn }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'badge-confirmed';
      case 'pending':
        return 'badge-pending';
      default:
        return '';
    }
  };

  return (
    <div className="checkin-card">
      <div className="checkin-card-header">
        <div className="guest-info">
          <div className="avatar">
            <img src={PersonIcon} alt="Guest" />
          </div>
          <div className="guest-details">
            <p className="guest-name">{booking.guestName}</p>
            <p className="booking-code">Mã: {booking.bookingCode}</p>
          </div>
        </div>
        <div className={`status-badge ${getBadgeClass(booking.status)}`}>
          {booking.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
        </div>
      </div>
      
      <div className="checkin-card-body">
        <div className="info-row">
          <img src={PhoneIcon} alt="Phone" className="info-icon" />
          <span className="info-text">{booking.phone}</span>
        </div>
        <div className="info-row">
          <img src={MailIcon} alt="Email" className="info-icon" />
          <span className="info-text">{booking.email}</span>
        </div>
        <div className="info-row">
          <img src={CalendarIcon} alt="Check-in" className="info-icon" />
          <span className="info-text">Check-in: {booking.checkInDate}</span>
        </div>
        <div className="info-row">
          <img src={CalendarIcon} alt="Check-out" className="info-icon" />
          <span className="info-text">Check-out: {booking.checkOutDate}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckInCard;
