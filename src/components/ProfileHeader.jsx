import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileHeader.css';
import SettingIcon from '../assets/icons/SettingIcon.svg';

const ProfileHeader = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add your sign out logic here
    if (window.confirm('Are you sure you want to sign out?')) {
      // Clear user session/token
      navigate('/signin');
    }
  };

  return (
    <div className="profile-header">
      <div className="profile-header-top">
        <div className="profile-user-info">
          <div className="profile-avatar">
            <span>SA</span>
          </div>
          <div className="profile-welcome">
            <h1>Welcome back, Sarah Anderson</h1>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="btn-setting">
            <img src={SettingIcon} alt="Settings" />
            <span>Settings</span>
          </button>
          <button className="btn-signout" onClick={handleSignOut}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10.6667 4.66667V3.33333C10.6667 2.59695 10.0697 2 9.33333 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H9.33333C10.0697 14 10.6667 13.403 10.6667 12.6667V11.3333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 8H14M14 8L12 6M14 8L12 10" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
