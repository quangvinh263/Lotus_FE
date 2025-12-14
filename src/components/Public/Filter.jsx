import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import './Filter.css';
import CalendarIcon from '../../assets/icons/CalendarIcon.png';
import PersonIcon from '../../assets/icons/PersonIcon.png';
import DatePicker from './DatePicker';
import PickerPanel from './PickerPanel';

const Filter = forwardRef(({ 
  onFilterChange = () => {},
  initialData
}, ref) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPickerPanelOpen, setIsPickerPanelOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(initialData?.checkInDate || null);
  const [checkOutDate, setCheckOutDate] = useState(initialData?.checkOutDate || null);
  const [rooms, setRooms] = useState(initialData?.rooms || 1);
  const [guests, setGuests] = useState(initialData?.guests || 2);

  useEffect(() => {
    if (initialData) {
      setCheckInDate(initialData.checkInDate);
      setCheckOutDate(initialData.checkOutDate);
      setRooms(initialData.rooms);
      setGuests(initialData.guests);
    }
  }, [initialData]);

  // Expose method to parent component
  useImperativeHandle(ref, () => ({
    openDatePicker: () => {
      setIsDatePickerOpen(true);
    }
  }));

  const formatDateRange = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 'Select dates';
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const formatDate = (date) => {
      if (!date || typeof date.getDay !== 'function') return '';
      return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
    };
    
    return `${formatDate(checkIn)} → ${formatDate(checkOut)}`;
  };

  const formatRoomsGuests = () => {
    return `${rooms} Room${rooms > 1 ? 's' : ''}, ${guests} Guest${guests > 1 ? 's' : ''}`;
  };

  const handleDateSelect = (checkIn, checkOut) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
    // Send keys matching parent `filterData` shape: checkInDate / checkOutDate
    onFilterChange({ checkInDate: checkIn, checkOutDate: checkOut, rooms, guests });
  };

  const handleRoomGuestApply = (selectedRooms, selectedGuests) => {
    setRooms(selectedRooms);
    setGuests(selectedGuests);
    onFilterChange({ checkInDate, checkOutDate, rooms: selectedRooms, guests: selectedGuests });
  };
  return (
    <>
      <div className="filter-component">
        {/* Date Selection Section */}
        <div className="filter-group">
          <div className="filter-label">Select dates</div>
          <button className="filter-input-field" onClick={() => setIsDatePickerOpen(true)}>
            <div className="input-content">
              <img src={CalendarIcon} alt="Calendar" className="input-icon" />
              <span className="input-text">{formatDateRange(checkInDate, checkOutDate)}</span>
            </div>
          </button>
        </div>

        {/* Room and Guest Selection Section */}
        <div className="filter-group">
          <div className="filter-label">Select rooms and guests</div>
          <button className="filter-input-field" onClick={() => setIsPickerPanelOpen(true)}>
            <div className="input-content">
              <img src={PersonIcon} alt="Person" className="input-icon" />
              <span className="input-text">{formatRoomsGuests()}</span>
            </div>
          </button>
        </div>
      </div>

      {/* DatePicker Modal */}
      <DatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onDateSelect={handleDateSelect}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      />

      {/* PickerPanel Modal */}
      <PickerPanel
        isOpen={isPickerPanelOpen}
        onClose={() => setIsPickerPanelOpen(false)}
        onApply={handleRoomGuestApply}
        initialRooms={rooms}
        initialGuests={guests}
      />
    </>
  );
});

export default Filter;