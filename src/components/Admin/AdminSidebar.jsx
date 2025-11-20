import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminSidebar.css';
import Logo from '../../assets/images/Logo.png';
import HouseIcon from '../../assets/icons/HouseIcon.svg';
import PeopleIcon from '../../assets/icons/PeopleIcon.svg';
import HotelIcon from '../../assets/icons/HotelIcon.svg';
import ReservationIcon from '../../assets/icons/ReservationIcon.svg';
import CustomerIcon from '../../assets/icons/CustomerIcon.svg';
import ServiceIcon from '../../assets/icons/ServiceIcon.svg';
import RevenueIcon from '../../assets/icons/RevenueIcon.svg';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: HouseIcon,
      path: '/admin/dashboard'
    },
    {
      id: 'employees',
      label: 'Quản lý Nhân viên',
      icon: PeopleIcon,
      path: '/admin/employees'
    },
    {
      id: 'rooms',
      label: 'Quản lý Phòng',
      icon: HotelIcon,
      path: '/admin/rooms'
    },
    {
      id: 'bookings',
      label: 'Quản lý đặt phòng',
      icon: ReservationIcon,
      path: '/admin/bookings'
    },
    {
      id: 'customers',
      label: 'Quản lý khách hàng',
      icon: CustomerIcon,
      path: '/admin/customers'
    },
    {
      id: 'services',
      label: 'Quản lý dịch vụ',
      icon: ServiceIcon,
      path: '/admin/services'
    },
    {
      id: 'revenue',
      label: 'Báo cáo doanh thu',
      icon: RevenueIcon,
      path: '/admin/revenue'
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-container">
        <div className="admin-sidebar-header">
          <img src={Logo} alt="Lotus Hotel" className="admin-sidebar-logo" />
          <div className="admin-sidebar-title">
            <h1 className="admin-title-main">Quản trị viên</h1>
            <p className="admin-title-sub">Quản lý khách sạn</p>
          </div>
        </div>

        <nav className="admin-sidebar-navigation">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-button ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.path)}
            >
              <img src={item.icon} alt={item.label} className="admin-nav-icon" />
              <span className="admin-nav-text">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
