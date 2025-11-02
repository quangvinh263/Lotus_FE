import React from 'react';
import './PersonalInfo.css';
import MailIcon from '../assets/icons/MailIcon.svg';
import PhoneIcon from '../assets/icons/PhoneIcon.svg';
import LocationIcon from '../assets/icons/LocationIcon.svg';

const PersonalInfo = () => {
  return (
    <div className="personal-info">
      <div className="personal-info-header">
        <h2>Personal Information</h2>
        <button className="btn-edit">
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
            <p className="info-value">sarah.anderson@email.com</p>
          </div>
        </div>
        
        <div className="info-item">
          <div className="info-icon">
            <img src={PhoneIcon} alt="Phone" />
          </div>
          <div className="info-details">
            <p className="info-label">Phone Number</p>
            <p className="info-value">+1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="info-item">
          <div className="info-icon">
            <img src={LocationIcon} alt="Location" />
          </div>
          <div className="info-details">
            <p className="info-label">Address</p>
            <p className="info-value">123 Park Avenue, New York, NY 10017</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
