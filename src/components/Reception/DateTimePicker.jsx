import { useState, useRef, useEffect } from 'react';
import CalenderIcon from '../../assets/icons/CalenderIcon.svg';
import './DateTimePicker.css';

function DateTimePicker({ value, onChange, placeholder = 'Chọn ngày' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const pickerRef = useRef(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateSelect = (date) => {
    onChange(date);
    setIsOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!value) return false;
    return date.getDate() === value.getDate() &&
           date.getMonth() === value.getMonth() &&
           date.getFullYear() === value.getFullYear();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="dtp-container" ref={pickerRef}>
      <button
        type="button"
        className="dtp-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={CalenderIcon} alt="Calendar" className="dtp-icon" />
        <span className={value ? 'dtp-value' : 'dtp-placeholder'}>
          {value ? formatDate(value) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="dtp-dropdown">
          <div className="dtp-header">
            <button
              type="button"
              className="dtp-nav-button"
              onClick={handlePrevMonth}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8L10 12" stroke="#133E87" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="dtp-month-year">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>

            <button
              type="button"
              className="dtp-nav-button"
              onClick={handleNextMonth}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="#133E87" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="dtp-calendar">
            <div className="dtp-weekdays">
              {daysOfWeek.map((day) => (
                <div key={day} className="dtp-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="dtp-days">
              {days.map((dayObj, index) => (
                <button
                  key={index}
                  type="button"
                  className={`dtp-day ${!dayObj.isCurrentMonth ? 'dtp-day-other-month' : ''} ${isToday(dayObj.date) ? 'dtp-day-today' : ''} ${isSelected(dayObj.date) ? 'dtp-day-selected' : ''}`}
                  onClick={() => handleDateSelect(dayObj.date)}
                >
                  {dayObj.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateTimePicker;
