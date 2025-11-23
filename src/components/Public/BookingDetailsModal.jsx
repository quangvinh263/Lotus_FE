import React from 'react';
import './BookingDetailsModal.css';
import CalenderIcon from '../../assets/icons/CalenderIcon.svg';
import PeopleIcon from '../../assets/icons/PeopleIcon.svg';

const BookingDetailsModal = ({ booking, isOpen, onClose, onCancelBooking, showCancelButton }) => {
  if (!isOpen || !booking) return null;

  const { hotelName, location, image, checkIn, checkOut, guests, rooms, status, isPast } = booking;

  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      onCancelBooking(booking.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Booking Details</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="modal-booking-image">
            <img src={image} alt={hotelName} />
          </div>
          
          <div className="modal-booking-info">
            <div className="modal-hotel-header">
              <h3>{hotelName}</h3>
              {status && <span className="modal-status-badge">{status}</span>}
            </div>
            
            <div className="modal-details-grid">
              <div className="modal-detail-item">
                <img src={CalenderIcon} alt="Calendar" />
                <div>
                  <p className="detail-label">Check-in</p>
                  <p className="detail-value">{checkIn}</p>
                </div>
              </div>
              
              <div className="modal-detail-item">
                <img src={CalenderIcon} alt="Calendar" />
                <div>
                  <p className="detail-label">Check-out</p>
                  <p className="detail-value">{checkOut}</p>
                </div>
              </div>
              
              <div className="modal-detail-item">
                <img src={PeopleIcon} alt="Guests" />
                <div>
                  <p className="detail-label">Guests</p>
                  <p className="detail-value">{guests} Guest{guests > 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div className="modal-detail-item">
                <img src={PeopleIcon} alt="Rooms" />
                <div>
                  <p className="detail-label">Rooms</p>
                  <p className="detail-value">{rooms} Room{rooms > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          {showCancelButton && (
            <button className="btn-cancel-booking" onClick={handleCancelBooking}>
              Cancel Booking
            </button>
          )}
          <button className="btn-close-modal" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
