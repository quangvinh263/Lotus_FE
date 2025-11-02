import React from 'react';
import './RoomBooking.css';
import ImageRoom from '../assets/images/ImageRoom.jpg';
import PersonIcon from '../assets/icons/PersonIcon.png';
import BedIcon from '../assets/icons/BedIcon.png';
import BathIcon from '../assets/icons/BathIcon.png';
import CalendarIcon from '../assets/icons/CalendarIcon.png';

const RoomBooking = ({ variant = 'default', isSelected = false, unavailableDates = null, onSelect = () => {}, onOpenDatePicker = () => {} }) => {
  const roomData = {
    name: 'Superior Room',
    price: 'VND 5,000,000',
    priceDescription: 'Cost for 1 night, 2 guests',
    capacity: 'Sleeps 2',
    bedType: '2 Single beds',
    bathroom: '1 Bathroom',
    description: `32m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

    A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.`
  };

  const renderAmenityItem = (icon, text) => (
    <div className="amenity-item">
      <img src={icon} alt="" className="amenity-icon" />
      <span className="amenity-text">{text}</span>
    </div>
  );

  const renderUnavailableDates = () => {
    if (!unavailableDates) return null;
    
    return (
      <div className="unavailable-dates">
        <div className="unavailable-info">
          <div className="unavailable-line"></div>
          <div className="unavailable-background"></div>
          <p className="unavailable-text">
            {unavailableDates} are unavailable
          </p>
          <div className="calendar-button" onClick={onOpenDatePicker}>
            <img src={CalendarIcon} alt="" className="calendar-icon" />
            <p className="find-dates-text">Find available dates</p>
          </div>
        </div>
        
      </div>
    );
  };

  return (
    <div className={`room-booking ${variant} ${isSelected ? 'selected' : ''}`}>
      <div className="room-image-container">
        <img src={ImageRoom} alt="Superior Room" className="room-image" />
      </div>
      
      <div className="room-content">
        <h3 className="room-title">{roomData.name}</h3>
        
        <div className="room-amenities">
          {renderAmenityItem(PersonIcon, roomData.capacity)}
          {renderAmenityItem(BedIcon, roomData.bedType)}
          {renderAmenityItem(BathIcon, roomData.bathroom)}
        </div>
        
        <p className="room-description">{roomData.description}</p>
        
        {variant === 'variant2' && renderUnavailableDates()}
        
        <div className="room-footer">
          <div className="pricing-info">
            <div className="price">{roomData.price}</div>
            <div className="price-description">{roomData.priceDescription}</div>
          </div>
          
          <button className="select-button" onClick={onSelect}>
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomBooking;