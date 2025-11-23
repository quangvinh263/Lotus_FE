import React, { useState } from 'react';
import './Footer.css';
import FacebookIcon from '../../assets/icons/FacebookIcon.svg';
import TwitterIcon from '../../assets/icons/TwitterIcon.svg';
import InstagramIcon from '../../assets/icons/InstagramIcon.svg';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    console.log('Subscribing:', email);
    // Add subscription logic here
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo">
          <div className="logo-text-large">LOTUS</div>
          <div className="logo-text-small">HOTELS</div>
        </div>

        {/* Social Media Links */}
        <div className="footer-social">
          <a href="#facebook" className="social-link">
            <img src={FacebookIcon} alt="Facebook" className="social-icon" />
            <span>Facebook</span>
          </a>
          <a href="#twitter" className="social-link">
            <img src={TwitterIcon} alt="Twitter" className="social-icon" />
            <span>Twitter</span>
          </a>
          <a href="#instagram" className="social-link">
            <img src={InstagramIcon} alt="Instagram" className="social-icon" />
            <span>Instagram</span>
          </a>
        </div>

        {/* Navigation Links */}
        <div className="footer-nav">
          <a href="#about" className="footer-link">About Us</a>
          <a href="#contact" className="footer-link">Contact</a>
          <a href="#terms" className="footer-link">Terms & Conditions</a>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer-newsletter">
          <div className="newsletter-title">Subscribe to our newsletter</div>
          <div className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="newsletter-button" onClick={handleSubscribe}>
              OK
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
