import React from 'react';
import './TopBar.css';
import Logo from '../../assets/images/Logo.png';
import PersonIcon from '../../assets/icons/PersonIcon.svg';

const TopBar = () => {
  return (
    <header className="reception-topbar">
      <div className="topbar-container">
        <div className="topbar-left">
          <img 
            src={Logo} 
            alt="Lotus Hotel Logo" 
            className="topbar-logo"
          />
          <div className="topbar-info">
            <h1 className="topbar-title">Lễ Tân</h1>
            <p className="topbar-subtitle">Hệ thống quản lý khách sạn</p>
          </div>
        </div>
        
        <div className="topbar-right">
          <div className="topbar-user">
            <div className="user-avatar">
              <img src={PersonIcon} alt="User" />
            </div>
            <span className="user-name">Nhân viên</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
