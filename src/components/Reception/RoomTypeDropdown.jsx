import { useState, useRef, useEffect } from 'react';
import './RoomTypeDropdown.css';

function RoomTypeDropdown({ value, onChange, roomTypes }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedRoom = roomTypes.find(rt => rt.name === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (roomName) => {
    onChange({ target: { name: 'roomType', value: roomName } });
    setIsOpen(false);
  };

  return (
    <div className="rtd-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="rtd-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="rtd-selected">
          {selectedRoom ? (
            <>
              <div className="rtd-selected-name">
                {selectedRoom.name} - {selectedRoom.price.toLocaleString('vi-VN')} VNĐ/đêm
              </div>
              <div className="rtd-selected-desc">{selectedRoom.description}</div>
            </>
          ) : (
            <span className="rtd-placeholder">Chọn loại phòng</span>
          )}
        </div>
        <svg
          className={`rtd-arrow ${isOpen ? 'rtd-arrow-open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="#133E87"
            strokeOpacity="0.5"
            strokeWidth="1.33333"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="rtd-menu">
          {roomTypes.map((room) => (
            <div
              key={room.id}
              className={`rtd-option ${value === room.name ? 'rtd-option-selected' : ''}`}
              onClick={() => handleSelect(room.name)}
            >
              <div className="rtd-option-name">
                {room.name} - {room.price.toLocaleString('vi-VN')} VNĐ/đêm
              </div>
              <div className="rtd-option-desc">{room.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RoomTypeDropdown;
