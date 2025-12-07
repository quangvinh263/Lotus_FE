import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import LogoImage from '../../assets/images/Logo.png';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  
  const isLoggedIn = !!auth.token;
  const userName = auth.accountId || 'Guest';
  const userRole = auth.role;

  const handleProfileClick = () => {
    if (isLoggedIn) {
      if (userRole === 'Admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'Reception') {
        navigate('/reception/checkin');
      } else {
        navigate('/profile');
      }
    } else {
      navigate('/signin');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo Section */}
          <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-image">
              <img src={LogoImage} alt="Lotus Hotel Logo" />
            </div>
            <div className="logo-text">Lotus Hotel</div>
          </div>

          {/* Navigation Links */}
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/booking" className="nav-link">Book</Link>
            <Link to="/facilities" className="nav-link">Facilities</Link>
            <Link to="/rooms" className="nav-link">Rooms</Link>
            <Link to="/about" className="nav-link">About us</Link>
            
            {isLoggedIn && userRole === 'Admin' && (
              <Link to="/admin/dashboard" className="nav-link">Admin</Link>
            )}
            {isLoggedIn && userRole === 'Reception' && (
              <Link to="/reception/checkin" className="nav-link">Reception</Link>
            )}
          </div>

          {/* Sign In Button or User Profile */}
          <div className="navbar-button">
            {isLoggedIn ? (
              // ✅ Đã tách ra thành một nhóm chứa 2 nút riêng biệt
              <div className="navbar-logged-in-group">
                
                {/* 1. Nút Profile */}
                <div className="navbar-profile-pill" onClick={handleProfileClick}>
                  <img src={PersonIcon} alt="User" className="navbar-user-icon" />
                  <span className="navbar-user-name">{userName}</span>
                </div>

                {/* 2. Nút Logout */}
                <button className="navbar-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="navbar-signin-btn" onClick={() => navigate('/signin')}>
                Sign In or Join
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;