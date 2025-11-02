import React from 'react';
import './RoomCard.css';
import ImageRoom from '../assets/images/ImageRoom.jpg';

const RoomCard = ({ 
  title = "Superior Room", 
  description = "A cozy retreat designed for comfort and simplicity, offering a peaceful space to unwind after a day of exploration.",
  imageUrl = ImageRoom,
  onExplore
}) => {
  return (
    <div className="room-card">
      {/* Content Section */}
      <div className="roomcard-content">
        <div className="room-text">
          <h2 className="room-title-card">{title}</h2>
          <p className="room-description-card">{description}</p>
          <button className="room-explore-btn" onClick={onExplore}>
            Explore
          </button>
        </div>
        <div className="room-divider"></div>
      </div>

      {/* Image Section */}
      <div className="roomcard-image">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className="room-image-placeholder">
            <span>Room Image</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
