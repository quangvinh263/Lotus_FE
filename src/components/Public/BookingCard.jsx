import React, { useState } from 'react';
import './BookingCard.css';
import CalenderIcon from '../../assets/icons/CalenderIcon.svg';
import PeopleIcon from '../../assets/icons/PeopleIcon.svg';
import BookingDetailsModal from './BookingDetailsModal';


const BookingCard = ({ booking, onCancelBooking }) => {
  const { hotelName, location, image, checkIn, checkOut, guests, rooms, status, isPast } = booking;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);

  const handleViewDetails = () => {
    setShowCancelButton(false);
    setIsModalOpen(true);
  };

  const handleModifyBooking = () => {
    setShowCancelButton(true);
    setIsModalOpen(true);
  };

  return (
    <div className="booking-card">
      <div className="booking-card-content">
        <div className="booking-image">
          <img src={image} alt={hotelName} />
        </div>
        
        <div className="booking-details">
          <div className="booking-info">
            <div className="booking-header">
              <div className="booking-title-section">
                <h3>{hotelName}</h3>
              </div>
              {status && <span className="booking-status">{status}</span>}
            </div>
            
            <div className="booking-meta">
              <div className="booking-dates">
                <img src={CalenderIcon} alt="Calendar" />
                <div>
                  <p>Check-in: {checkIn}</p>
                  <p>Check-out: {checkOut}</p>
                </div>
              </div>
              
              <div className="booking-guests">
                <img src={PeopleIcon} alt="Guests" />
                <p>{guests} Guest{guests > 1 ? 's' : ''} • {rooms} Room{rooms > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
          
          <div className="booking-actions">
            <button 
              className={`btn-view-details ${isPast ? 'secondary' : 'primary'}`}
              onClick={handleViewDetails}
            >
              View Details
            </button>
            {!isPast && (
              <button className="btn-modify" onClick={handleModifyBooking}>
                Modify Booking
              </button>
            )}
          </div>
        </div>
      </div>
      
      <BookingDetailsModal 
        booking={booking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancelBooking={onCancelBooking}
        showCancelButton={showCancelButton}
      />
    </div>
  );
};

export default BookingCard;
