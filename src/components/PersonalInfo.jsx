import React, { useState } from 'react';
import './PersonalInfo.css';
import MailIcon from '../assets/icons/MailIcon.svg';
import PhoneIcon from '../assets/icons/PhoneIcon.svg';
import LocationIcon from '../assets/icons/LocationIcon.svg';

const PersonalInfo = () => {
  const [showModal, setShowModal] = useState(false);
  const [personalData, setPersonalData] = useState({
    email: 'sarah.anderson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Park Avenue, New York, NY 10017'
  });
  const [editData, setEditData] = useState({ ...personalData });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleOpenModal = () => {
    setShowModal(true);
    setEditData({ ...personalData });
    setMessage({ type: '', text: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditData({ ...personalData });
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    // Validation
    if (!editData.email || !editData.phone || !editData.address) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    // TODO: Add API call to update personal info
    console.log('Updating personal info...', editData);
    
    // Update local state
    setPersonalData(editData);
    setMessage({ type: 'success', text: 'Personal information updated successfully!' });
    
    // Close modal after 2 seconds
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
  };

  return (
    <>
      <div className="personal-info">
        <div className="personal-info-header">
          <h2>Personal Information</h2>
          <button className="btn-edit" onClick={handleOpenModal}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 11.3333V14H4.66667L11.8733 6.79333L9.20667 4.12667L2 11.3333Z" stroke="#608BC1" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.9067 3.76L13.24 4.09333C13.7467 4.6 13.7467 5.42 13.24 5.92667L12.58 6.58667L9.91333 3.92L10.5733 3.26C11.08 2.75333 11.9 2.75333 12.4067 3.26L12.7733 3.62667C13.0267 3.88 13.1667 4.22 13.1667 4.57333C13.1667 4.92667 13.0267 5.26667 12.7733 5.52L12.9067 3.76Z" stroke="#608BC1" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Edit</span>
          </button>
        </div>
        
        <div className="personal-info-content">
          <div className="info-item">
            <div className="info-icon">
              <img src={MailIcon} alt="Email" />
            </div>
            <div className="info-details">
              <p className="info-label">Email Address</p>
              <p className="info-value">{personalData.email}</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">
              <img src={PhoneIcon} alt="Phone" />
            </div>
            <div className="info-details">
              <p className="info-label">Phone Number</p>
              <p className="info-value">{personalData.phone}</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">
              <img src={LocationIcon} alt="Location" />
            </div>
            <div className="info-details">
              <p className="info-label">Address</p>
              <p className="info-value">{personalData.address}</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="pi-modal-overlay" onClick={handleCloseModal}>
          <div className="pi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pi-modal-header">
              <h3>Edit Personal Information</h3>
              <button className="pi-modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="pi-modal-content">
              {message.text && (
                <div className={`pi-message pi-message-${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="pi-form-field">
                <label>
                  <img src={MailIcon} alt="Email" className="pi-field-icon" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="pi-form-field">
                <label>
                  <img src={PhoneIcon} alt="Phone" className="pi-field-icon" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="pi-form-field">
                <label>
                  <img src={LocationIcon} alt="Address" className="pi-field-icon" />
                  <span>Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div className="pi-modal-actions">
              <button className="pi-btn-cancel" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="pi-btn-save" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfo;
