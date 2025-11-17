import React from 'react';
import './RoomSection.css';
import ImageRoom from '../../assets/images/ImageRoom.jpg';
import ApartmentIcon from '../../assets/icons/ApartmentIcon.png';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import BedIcon from '../../assets/icons/BedIcon.png';
import ImageIcon from '../../assets/icons/ImageIcon.svg';
import SmokeIcon from '../../assets/icons/SmokeIcon.png';
import BathIcon from '../../assets/icons/BathIcon.svg';

const RoomSection = ({ 
  roomType = "SUPERIOR ROOM",
  price = "USD200",
  imageUrl = ImageRoom,
  description = "A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.",
  roomSize = "32 sqm",
  beds = "1 King bed or 2 Single beds",
  maxOccupancy = "2 pax",
  view = "City view",
  smoking = "No",
  bathroom = "Toilet, washbasin, and shower",
  onBookRoom,
  onMoreInfo
}) => {
  return (
    <div className="room-section">
      {/* Image */}
      <div className="room-section-image">
        {imageUrl ? (
          <img src={imageUrl} alt={roomType} />
        ) : (
          <div className="room-section-image-placeholder" />
        )}
      </div>

      {/* Room Type and Price */}
      <div className="room-section-header">
        <h2 className="room-section-title">
          {roomType}
          <br />
          <p className="room-section-price">
          Available from {price}
          </p>
        </h2>
      </div>

      {/* Divider Line */}
      <div className="room-section-divider"></div>

      {/* Details Section */}
      <div className="room-section-details">
        {/* Description */}
        <p className="room-section-description">{description}</p>

        {/* Specifications */}
        <div className="room-section-specs">
          {/* Left Column */}
          <div className="room-spec-group">
            <img src={ApartmentIcon} alt="Room size" className="room-spec-icon room-spec-icon-apartment" />
            <div className="room-spec-text-left">
              Room size: {roomSize}
              <br />
              Beds: {beds}
              <br />
              Max occupancy: {maxOccupancy}
            </div>
            <img src={PersonIcon} alt="Person" className="room-spec-icon room-spec-icon-person" />
            <img src={BedIcon} alt="Bed" className="room-spec-icon room-spec-icon-bed" />
          </div>

          {/* Right Column */}
          <div className="room-spec-group">
            <img src={ImageIcon} alt="View" className="room-spec-icon room-spec-icon-image" />
            <div className="room-spec-text-right">
              View: {view}
              <br />
              Smoking: {smoking}
              <br />
              Bathroom: {bathroom}
            </div>
            <img src={SmokeIcon} alt="Smoking" className="room-spec-icon room-spec-icon-smoke" />
            <img src={BathIcon} alt="Bathroom" className="room-spec-icon room-spec-icon-bath" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="room-section-buttons">
        <button className="room-section-btn room-section-btn-primary" onClick={onBookRoom}>
          Book a room
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 4L12 8L8 12M12 8H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="room-section-btn room-section-btn-secondary" onClick={onMoreInfo}>
          More info
          <svg width="17.45" height="16" viewBox="0 0 18 16" fill="none">
            <path d="M9 4L13 8L9 12M13 8H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RoomSection;
