import React from 'react';
import './BookingSummary.css';
import BinIcon from '../../assets/icons/BinIcon.png';

const BookingSummary = ({ 
  variant = 'default',
  bookingData = {
    dates: 'Sat, 18 Oct 25 - Sun, 19 Oct 25',
    rooms: '1 room, 2 guests',
    nights: '1 night',
    roomType: 'Superior Room',
    roomDetails: '2 guests, 1 night\nNon-refundable',
    price: 'VND 5,000,000',
    totalPrice: 'VND 5,000,000 total',
    deposit: 'Deposit: VND 5,000,000',
    selectedRooms: []
  },
  onBook = () => {},
  onDeleteRoom = () => {}
}) => {

  const renderDefaultVariant = () => (
    <>
      {/* Price Section */}
      <div className="order-section">
        <div className="order-text">Booking Summary</div>
      </div>

      {/* Booking Details Section */}
      <div className="booking-details">
        <div className="dates-info">
          <div className="date-text">{bookingData.dates}</div>
          <div className="room-info">{bookingData.rooms}</div>
        </div>
        <div className="nights-info">{bookingData.nights}</div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Room Details - Loop through selected rooms */}
      {bookingData.selectedRooms && bookingData.selectedRooms.length > 0 ? (
        bookingData.selectedRooms.map((room, index) => (
          <React.Fragment key={room.id}>
            <div className="room-details">
              <div className="room-header">
                <h3 className="room-title-summarize">{room.name}</h3>
                <button 
                  className="delete-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDeleteRoom(room.id);
                  }}
                >
                  <img src={BinIcon} alt="Delete" className="delete-icon" />
                </button>
              </div>
              <div className="room-info-row">
                <div className="room-description-summarize">{room.details}</div>
                <div className="room-price">{room.price}</div>
              </div>
            </div>
            {/* Divider after each room except the last one */}
            {index < bookingData.selectedRooms.length - 1 && <div className="divider"></div>}
          </React.Fragment>
        ))
      ) : null}

      {/* Divider before Total */}
      <div className="divider"></div>

      {/* Total Section */}
      <div className="total-section">
        <div className="total-row">
          <span className="total-label">Total</span>
          <span className="total-amount">{bookingData.totalPrice}</span>
        </div>
        <div className="deposit-info">
          <span className="deposit-text">{bookingData.deposit}</span>
        </div>
      </div>

      {/* Book Button */}
      <div className="book-button-container">
        <button className="book-button" onClick={onBook}>
          Book
        </button>
      </div>
    </>
  );

  const renderVariant2 = () => (
    <>
      {/* Booking Details Section */}
      <div className="booking-details-simple">
        <div className="date-text">{bookingData.dates}</div>
        <div className="room-info">{bookingData.rooms}</div>
        <div className="nights-info">{bookingData.nights}</div>
      </div>

      {/* Divider */}
      <div className="divider-simple"></div>

      {/* Select Message */}
      <div className="select-message">
        <span className="select-text">Select a rate to continue</span>
      </div>

      {/* Book Button */}
      <div className="book-button-container">
        <button className="book-button full-width" onClick={onBook}>
          Book
        </button>
      </div>
    </>
  );

  return (
    <div className={`booking-summary ${variant}`}>
      {variant === 'variant2' ? renderVariant2() : renderDefaultVariant()}
    </div>
  );
};

export default BookingSummary;