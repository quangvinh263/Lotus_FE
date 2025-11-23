import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import LogoImage from '../../assets/images/Logo.png';
import PersonIcon from '../../assets/icons/PersonIcon.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is logged in (you can use localStorage, sessionStorage, or context)
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const name = localStorage.getItem('userName') || 'Guest';
    setIsLoggedIn(loggedIn);
    setUserName(name);
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/signin');
    }
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
          </div>

          {/* Sign In Button or User Profile */}
          <div className="navbar-button">
            {isLoggedIn ? (
              <div className="navbar-user-info" onClick={handleProfileClick}>
                <img src={PersonIcon} alt="User" className="navbar-user-icon" />
                <span className="navbar-user-name">{userName}</span>
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
