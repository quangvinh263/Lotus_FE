import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import Logo from '../../assets/images/Logo.png';
import HotelIcon from '../../assets/icons/HotelIcon.svg';
import CheckInIcon from '../../assets/icons/CheckInIcon.svg';
import CheckOutIcon from '../../assets/icons/CheckOutIcon.svg';
import ReservationIcon from '../../assets/icons/ReservationIcon.svg';
import CalendarIcon from '../../assets/icons/CalenderIcon.svg';
import ServiceIcon from '../../assets/icons/ServiceIcon.svg';

const Sidebar = ({ variant = 'default' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', path: '/reception/dashboard', icon: HotelIcon },
    { id: 'checkin', label: 'Quản lý Check-in', path: '/reception/checkin', icon: CheckInIcon },
    { id: 'checkout', label: 'Quản lý Check-out', path: '/reception/checkout', icon: CheckOutIcon },
    { id: 'create-booking', label: 'Tạo đơn đặt phòng', path: '/reception/create-booking', icon: ReservationIcon },
    { id: 'bookings', label: 'Quản lý đặt phòng', path: '/reception/booking-management', icon: CalendarIcon },
    { id: 'services', label: 'Quản lý dịch vụ', path: '/reception/services', icon: ServiceIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="reception-sidebar">
      <div className="sidebar-container">
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <img 
              src={HotelIcon} 
              alt="Lotus Hotel Logo" 
              className="sidebar-logo"
            />
          </div>
          <div className="sidebar-info">
            <h2 className="sidebar-title">Lễ Tân</h2>
            <p className="sidebar-subtitle">Quản lý khách sạn</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <img src={item.icon} alt={item.label} className="nav-icon" />
              <span className="nav-text">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
