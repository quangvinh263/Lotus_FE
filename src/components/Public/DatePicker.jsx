import React, { useState } from 'react';
import './DatePicker.css';

const DatePicker = ({ 
  isOpen = false,
  onClose = () => {},
  onDateSelect = () => {},
  checkInDate = null,
  checkOutDate = null
}) => {
  const [selectedCheckIn, setSelectedCheckIn] = useState(checkInDate);
  const [selectedCheckOut, setSelectedCheckOut] = useState(checkOutDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateClick = (date) => {
    if (!date) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return; // Don't allow past dates

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      // First selection or reset
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
    } else if (date > selectedCheckIn) {
      // Valid check-out date
      setSelectedCheckOut(date);
    } else {
      // If clicked date is before check-in, reset with new check-in
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
    }
  };

  const handleApply = () => {
    if (selectedCheckIn && selectedCheckOut) {
      onDateSelect(selectedCheckIn, selectedCheckOut);
      onClose();
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDate = (date) => {
    if (!date) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const isDateInRange = (date) => {
    if (!date || !selectedCheckIn || !selectedCheckOut) return false;
    return date > selectedCheckIn && date < selectedCheckOut;
  };

  const isDateSelected = (date) => {
    if (!date) return false;
    return (selectedCheckIn && date.getTime() === selectedCheckIn.getTime()) ||
           (selectedCheckOut && date.getTime() === selectedCheckOut.getTime());
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (!isOpen) return null;

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="datepicker-overlay" onClick={onClose}>
      <div className="datepicker-panel" onClick={(e) => e.stopPropagation()}>
        <div className="datepicker-header">
          <h3 className="datepicker-title">Select Dates</h3>
          <button className="datepicker-close" onClick={onClose}>×</button>
        </div>

        <div className="datepicker-selection">
          <div className="date-display">
            <div className="date-label">Check-in</div>
            <div className="date-value">{selectedCheckIn ? formatDate(selectedCheckIn) : 'Select date'}</div>
          </div>
          <div className="date-arrow">→</div>
          <div className="date-display">
            <div className="date-label">Check-out</div>
            <div className="date-value">{selectedCheckOut ? formatDate(selectedCheckOut) : 'Select date'}</div>
          </div>
        </div>

        <div className="datepicker-calendar">
          <div className="calendar-navigation">
            <button className="nav-button" onClick={handlePrevMonth}>‹</button>
            <div className="calendar-month">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button className="nav-button" onClick={handleNextMonth}>›</button>
          </div>

          <div className="calendar-grid">
            {daysOfWeek.map((day) => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            
            {days.map((date, index) => (
              <div
                key={index}
                className={`calendar-day ${!date ? 'empty' : ''} 
                  ${isDateSelected(date) ? 'selected' : ''} 
                  ${isDateInRange(date) ? 'in-range' : ''}
                  ${isDateDisabled(date) ? 'disabled' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                {date ? date.getDate() : ''}
              </div>
            ))}
          </div>
        </div>

        <div className="datepicker-footer">
          <button className="datepicker-button cancel" onClick={onClose}>Cancel</button>
          <button 
            className="datepicker-button apply" 
            onClick={handleApply}
            disabled={!selectedCheckIn || !selectedCheckOut}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;