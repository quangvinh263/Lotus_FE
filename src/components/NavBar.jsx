import React from 'react';
import './Navbar.css';
import LogoImage from '../assets/images/Logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo Section */}
          <div className="navbar-logo">
            <div className="logo-image">
              <img src={LogoImage} alt="Lotus Hotel Logo" />
            </div>
            <div className="logo-text">Lotus Hotel</div>
          </div>

          {/* Navigation Links */}
          <div className="navbar-links">
            <a href="#home" className="nav-link active">Home</a>
            <a href="#book" className="nav-link">Book</a>
            <a href="#facilities" className="nav-link">Facilities</a>
            <a href="#rooms" className="nav-link">Rooms</a>
            <a href="#about" className="nav-link">About us</a>
          </div>

          {/* Sign In Button */}
          <div className="navbar-button">
            <button className="navbar-signin-btn">
              Sign In or Join
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
