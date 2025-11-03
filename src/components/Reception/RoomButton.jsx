import React from 'react';
import './RoomButton.css';
import RoomIcon from '../../assets/icons/RoomIcon.svg';

const RoomButton = ({ room, isSelected, onSelect }) => {
  return (
    <button
      className={`room-button ${isSelected ? 'room-button-selected' : ''}`}
      onClick={() => onSelect(room)}
    >
      <div className="room-button-header">
        <div className="room-number-container">
          <img src={RoomIcon} alt="Room" className="room-icon" />
          <span className="room-number">Phòng {room.number}</span>
        </div>
        <div className="roombutton-type-badge">{room.type}</div>
      </div>
      <p className="room-price">{room.price.toLocaleString('vi-VN')} VNĐ/đêm</p>
    </button>
  );
};

export default RoomButton;
