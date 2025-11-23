import React, { useState } from 'react';
import '../../styles/FirstTimePersonalInfo.css';
import { useNavigate } from 'react-router-dom';
import MailIcon from '../../assets/icons/MailIcon.svg';
import PhoneIcon from '../../assets/icons/PhoneIcon.svg';
import LocationIcon from '../../assets/icons/LocationIcon.svg';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import CalenderIcon from '../../assets/icons/CalenderIcon.svg';
import GenderIcon from '../../assets/icons/GenderIcon.svg';

const FirstTimePersonalInfoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
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
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Add API call to save personal information
      console.log('Saving personal information:', formData);
      
      // Navigate to home page or dashboard
      navigate('/');
    }
  };

  const handleSkip = () => {
    // Navigate to home page without saving
    navigate('/');
  };

  return (
    <div className="ftpi-container">
      <div className="ftpi-card">
        <div className="ftpi-header">
          <h1>Complete Your Profile</h1>
          <p>Please provide your personal information to get started</p>
        </div>

        <form className="ftpi-form" onSubmit={handleSubmit}>
          <div className="ftpi-form-grid">
            {/* Full Name */}
            <div className="ftpi-form-field ftpi-full-width">
              <label>
                <img src={PersonIcon} alt="Person" className="ftpi-field-icon" />
                <span>Full Name</span>
                <span className="ftpi-required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.fullName ? 'ftpi-input-error' : ''}
              />
              {errors.fullName && <span className="ftpi-error-text">{errors.fullName}</span>}
            </div>

            {/* Email */}
            <div className="ftpi-form-field ftpi-full-width">
              <label>
                <img src={MailIcon} alt="Email" className="ftpi-field-icon" />
                <span>Email Address</span>
                <span className="ftpi-required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={errors.email ? 'ftpi-input-error' : ''}
              />
              {errors.email && <span className="ftpi-error-text">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="ftpi-form-field ftpi-full-width">
              <label>
                <img src={PhoneIcon} alt="Phone" className="ftpi-field-icon" />
                <span>Phone Number</span>
                <span className="ftpi-required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={errors.phone ? 'ftpi-input-error' : ''}
              />
              {errors.phone && <span className="ftpi-error-text">{errors.phone}</span>}
            </div>

            {/* Address */}
            <div className="ftpi-form-field ftpi-full-width">
              <label>
                <img src={LocationIcon} alt="Location" className="ftpi-field-icon" />
                <span>Street Address</span>
                <span className="ftpi-required">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your street address"
                className={errors.address ? 'ftpi-input-error' : ''}
              />
              {errors.address && <span className="ftpi-error-text">{errors.address}</span>}
            </div>

            {/* Date of Birth and Gender */}
            <div className="ftpi-form-field">
              <label>
                <img src={CalenderIcon} alt="Date of Birth" className="ftpi-field-icon" />
                <span>Date of Birth</span>
                <span className="ftpi-required">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={errors.dateOfBirth ? 'ftpi-input-error' : ''}
              />
              {errors.dateOfBirth && <span className="ftpi-error-text">{errors.dateOfBirth}</span>}
            </div>

            <div className="ftpi-form-field">
              <label>
                <img src={GenderIcon} alt="Gender" className="ftpi-field-icon" />
                <span>Gender</span>
                <span className="ftpi-required">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={errors.gender ? 'ftpi-input-error' : ''}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="ftpi-error-text">{errors.gender}</span>}
            </div>
          </div>

          <div className="ftpi-actions">
            <button type="submit" className="ftpi-btn-submit">
              Complete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirstTimePersonalInfoPage;
