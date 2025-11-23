import React, { useState } from 'react';
import './PickerPanel.css';

const PickerPanel = ({ 
  isOpen = false,
  onClose = () => {},
  onApply = () => {},
  initialRooms = 1,
  initialGuests = 2
}) => {
  const [rooms, setRooms] = useState(initialRooms);
  const [guests, setGuests] = useState(initialGuests);

  const handleIncrement = (type) => {
    if (type === 'rooms') {
      if (rooms < 10) setRooms(rooms + 1);
    } else if (type === 'guests') {
      if (guests < 20) setGuests(guests + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === 'rooms') {
      if (rooms > 1) setRooms(rooms - 1);
    } else if (type === 'guests') {
      if (guests > 1) setGuests(guests - 1);
    }
  };

  const handleApply = () => {
    onApply(rooms, guests);
    onClose();
  };

  const handleReset = () => {
    setRooms(1);
    setGuests(2);
  };

  if (!isOpen) return null;

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-panel" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <h3 className="picker-title">Select Rooms & Guests</h3>
          <button className="picker-close" onClick={onClose}>×</button>
        </div>

        <div className="picker-content">
          {/* Rooms Counter */}
          <div className="counter-row">
            <div className="counter-info">
              <div className="counter-label">Rooms</div>
              <div className="counter-description">Number of rooms needed</div>
            </div>
            <div className="counter-controls">
              <button 
                className="counter-button" 
                onClick={() => handleDecrement('rooms')}
                disabled={rooms <= 1}
              >
                −
              </button>
              <div className="counter-value">{rooms}</div>
              <button 
                className="counter-button" 
                onClick={() => handleIncrement('rooms')}
                disabled={rooms >= 10}
              >
                +
              </button>
            </div>
          </div>

          <div className="picker-divider"></div>

          {/* Guests Counter */}
          <div className="counter-row">
            <div className="counter-info">
              <div className="counter-label">Guests</div>
              <div className="counter-description">Number of guests</div>
            </div>
            <div className="counter-controls">
              <button 
                className="counter-button" 
                onClick={() => handleDecrement('guests')}
                disabled={guests <= 1}
              >
                −
              </button>
              <div className="counter-value">{guests}</div>
              <button 
                className="counter-button" 
                onClick={() => handleIncrement('guests')}
                disabled={guests >= 20}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="picker-footer">
          <button className="picker-button reset" onClick={handleReset}>Reset</button>
          <button className="picker-button apply" onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default PickerPanel;