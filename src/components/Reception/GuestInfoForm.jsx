import React, { useState } from 'react';
import './GuestInfoForm.css';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import PhoneIcon from '../../assets/icons/PhoneIcon.svg';
import MailIcon from '../../assets/icons/MailIcon.svg';
import IdCardIcon from '../../assets/icons/PersonIcon.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';

const GuestInfoForm = ({ guests, onGuestsChange, totalGuests, showIdNumber = false }) => {
  const [expandedGuest, setExpandedGuest] = useState(0); // Mặc định mở khách đầu tiên

  const handleGuestChange = (index, field, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = {
      ...updatedGuests[index],
      [field]: value
    };
    onGuestsChange(updatedGuests);
  };

  const addGuest = () => {
    if (guests.length < totalGuests) {
      const newGuest = showIdNumber 
        ? {
            fullName: '',
            idNumber: '',
            gender: 'male',
            isPrimary: guests.length === 0
          }
        : {
            fullName: '',
            phoneNumber: '',
            email: '',
            isPrimary: guests.length === 0
          };
      
      onGuestsChange([...guests, newGuest]);
      setExpandedGuest(guests.length); // Mở form của khách mới thêm
    }
  };

  const removeGuest = (index) => {
    if (guests.length > 1 && !guests[index].isPrimary) {
      const updatedGuests = guests.filter((_, i) => i !== index);
      onGuestsChange(updatedGuests);
      if (expandedGuest === index) {
        setExpandedGuest(0);
      }
    }
  };

  const toggleGuest = (index) => {
    setExpandedGuest(expandedGuest === index ? -1 : index);
  };

  return (
    <div className="guest-info-form">
      <div className="guest-form-header">
        <h3 className="guest-form-title">Thông tin khách lưu trú</h3>
        <p className="guest-form-subtitle">
          {showIdNumber 
            ? 'Nhập thông tin TẤT CẢ khách thực tế lưu trú (tối đa theo sức chứa phòng)'
            : 'Người đại diện đặt phòng'
          }
        </p>
        <div className="guest-count-badge">
          {guests.length}/{totalGuests} khách (tối đa)
        </div>
      </div>

      <div className="guests-list">
        {guests.map((guest, index) => (
          <div key={index} className={`guest-card ${expandedGuest === index ? 'expanded' : ''}`}>
            <div className="guest-card-header" onClick={() => toggleGuest(index)}>
              <div className="guest-header-left">
                <span className="guest-number">Khách {index + 1}</span>
                {guest.isPrimary && <span className="primary-badge">Người đại diện</span>}
                {guest.fullName && <span className="guest-name-preview">{guest.fullName}</span>}
              </div>
              <div className="guest-header-right">
                {!guest.isPrimary && guests.length > 1 && (
                  <button
                    className="remove-guest-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGuest(index);
                    }}
                    title="Xóa khách"
                  >
                    <img src={DeleteIcon} alt="Delete" />
                  </button>
                )}
                <span className="expand-icon">
                  {expandedGuest === index ? '▼' : '▶'}
                </span>
              </div>
            </div>

            {expandedGuest === index && (
              <div className="guest-card-body">
                <div className="guest-form-grid">
                  {/* Họ và tên - luôn hiển thị */}
                  <div className="guest-form-field guest-field-full">
                    <label className="guest-label">
                      Họ và tên <span className="required">*</span>
                    </label>
                    <div className="guest-input-wrapper">
                      <input
                        type="text"
                        className="guest-input"
                        value={guest.fullName}
                        onChange={(e) => handleGuestChange(index, 'fullName', e.target.value)}
                        placeholder="Nhập họ và tên"
                      />
                      <img src={PersonIcon} alt="Person" className="guest-input-icon" />
                    </div>
                  </div>

                  {/* Check-in: CMND và Giới tính */}
                  {showIdNumber ? (
                    <>
                      <div className="guest-form-field">
                        <label className="guest-label">
                          CMND/CCCD <span className="required">*</span>
                        </label>
                        <div className="guest-input-wrapper">
                          <input
                            type="text"
                            className="guest-input"
                            value={guest.idNumber}
                            onChange={(e) => handleGuestChange(index, 'idNumber', e.target.value)}
                            placeholder="Nhập số CMND/CCCD"
                          />
                          <img src={IdCardIcon} alt="ID Card" className="guest-input-icon" />
                        </div>
                      </div>

                      <div className="guest-form-field">
                        <label className="guest-label">
                          Giới tính <span className="required">*</span>
                        </label>
                        <select
                          className="guest-input guest-select"
                          value={guest.gender || 'male'}
                          onChange={(e) => handleGuestChange(index, 'gender', e.target.value)}
                        >
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    /* Đặt phòng: SĐT và Email */
                    <>
                      <div className="guest-form-field">
                        <label className="guest-label">
                          Số điện thoại <span className="required">*</span>
                        </label>
                        <div className="guest-input-wrapper">
                          <input
                            type="tel"
                            className="guest-input"
                            value={guest.phoneNumber}
                            onChange={(e) => handleGuestChange(index, 'phoneNumber', e.target.value)}
                            placeholder="Nhập số điện thoại"
                          />
                          <img src={PhoneIcon} alt="Phone" className="guest-input-icon" />
                        </div>
                      </div>

                      <div className="guest-form-field">
                        <label className="guest-label">Email</label>
                        <div className="guest-input-wrapper">
                          <input
                            type="email"
                            className="guest-input"
                            value={guest.email}
                            onChange={(e) => handleGuestChange(index, 'email', e.target.value)}
                            placeholder="Nhập email"
                          />
                          <img src={MailIcon} alt="Email" className="guest-input-icon" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {guests.length < totalGuests && (
        <button className="add-guest-btn" onClick={addGuest}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.33333V12.6667" stroke="#133E87" strokeWidth="1.33333" strokeLinecap="round"/>
            <path d="M3.33333 8H12.6667" stroke="#133E87" strokeWidth="1.33333" strokeLinecap="round"/>
          </svg>
          <span>Thêm khách ({guests.length}/{totalGuests})</span>
        </button>
      )}

      {guests.length >= totalGuests && (
        <div className="guest-complete-badge">
          ✓ Đã đầy đủ thông tin {totalGuests} khách
        </div>
      )}
    </div>
  );
};

export default GuestInfoForm;
