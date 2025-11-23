import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../../components//Public/NavBar';
import '../../styles/GuestInfoPage.css';

function GuestInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {};

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s+-]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/payment', {
        state: {
          ...bookingData,
          guestInfo: formData
        }
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="guest-info-page">
      <NavBar />
      
      <div className="guest-info-container">
        <div className="guest-info-header">
          <button className="guest-info-back-button" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#133E87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1>Guest Information</h1>
        </div>

        <div className="guest-info-content-wrapper">
        
          <form className="guest-info-form" onSubmit={handleSubmit}>
            <div className="guest-form-card">
              <h2>Personal Details</h2>

              <div className="guest-form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="guest-error-message">{errors.fullName}</span>}
              </div>

              <div className="guest-form-row">
                <div className="guest-form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="guest-error-message">{errors.email}</span>}
                </div>

                <div className="guest-form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+84 123 456 789"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="guest-error-message">{errors.phone}</span>}
                </div>
              </div>

              <div className="guest-form-group">
                <label htmlFor="specialRequests">Special Requests (Optional)</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any special requests for your stay?"
                  rows="5"
                />
              </div>
            </div>

            <div className="guest-form-actions">
              <button type="button" className="guest-btn-back" onClick={handleBack}>
                Back
              </button>
              <button type="submit" className="guest-btn-continue">
                Continue to Payment
              </button>
            </div>
          </form>
          <div className="guest-booking-summary-card">
            <h2>Booking Summary</h2>
            <div className="guest-summary-details">
              <div className="guest-summary-item">
                <span className="label">Room:</span>
                <span className="value">{bookingData.roomType || 'Superior Room'}</span>
              </div>
              <div className="guest-summary-item">
                <span className="label">Check-in:</span>
                <span className="value">{bookingData.checkIn || 'Sat, 18 Oct 2025'}</span>
              </div>
              <div className="guest-summary-item">
                <span className="label">Check-out:</span>
                <span className="value">{bookingData.checkOut || 'Sun, 19 Oct 2025'}</span>
              </div>
              <div className="guest-summary-item">
                <span className="label">Guests:</span>
                <span className="value">{bookingData.guests || '2 adults'}</span>
              </div>
              <div className="guest-summary-item">
                <span className="label">Total:</span>
                <span className="value">{bookingData.total || 'VND 5,000,000'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestInfoPage;
