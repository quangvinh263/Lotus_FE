import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import LogoImage from '../assets/images/Logo.png';

const Navbar = () => {
  const navigate = useNavigate();

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

          {/* Sign In Button */}
          <div className="navbar-button">
            <button className="navbar-signin-btn" onClick={() => navigate('/signin')}>
              Sign In or Join
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
