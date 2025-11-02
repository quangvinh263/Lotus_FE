import { useEffect } from 'react';
import './BookingConfirmationPopup.css';

function BookingConfirmationPopup({ isOpen, onClose, guestName, bookingReference }) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-backdrop" onClick={handleBackdropClick}>
      <div className="popup-box">
        {/* Success Icon */}
        <div className="popup-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle 
              cx="40" 
              cy="40" 
              r="33.33" 
              stroke="#133E87" 
              strokeWidth="6.67" 
              fill="none"
            />
            <path 
              d="M25 40L35 50L55 30" 
              stroke="#133E87" 
              strokeWidth="6.67" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="popup-heading">Booking Confirmed!</h1>

        {/* Message */}
        <p className="popup-message">
          Thank you for your reservation, {guestName || 'Guest'}
        </p>

        {/* Booking Reference */}
        <div className="booking-reference-box">
          <p className="reference-label">Booking Reference</p>
          <p className="reference-code">{bookingReference || 'LOTUS21414800'}</p>
        </div>

        {/* Button */}
        <button className="popup-button" onClick={onClose}>
          Make Another Booking
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmationPopup;
