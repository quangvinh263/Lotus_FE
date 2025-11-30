import React, { useState, useContext } from 'react';
import '../../styles/FirstTimePersonalInfo.css';
import { useNavigate } from 'react-router-dom';
import MailIcon from '../../assets/icons/MailIcon.svg';
import PhoneIcon from '../../assets/icons/PhoneIcon.svg';
import LocationIcon from '../../assets/icons/LocationIcon.svg';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import CalenderIcon from '../../assets/icons/CalenderIcon.svg';
import GenderIcon from '../../assets/icons/GenderIcon.svg';
import { AuthContext } from '../../context/AuthContext';
import { createPersonalInfo } from '../../api/customerApi';


const FirstTimePersonalInfoPage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    FullName: '',
    Phone: '',
    Address: '',
    DateOfBirth: '',
    Gender: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.FullName.trim()) {
      newErrors.FullName = 'Full name is required';
    }

    if (!formData.Phone.trim()) {
      newErrors.Phone = 'Phone number is required';
    }

    if (!formData.Address.trim()) {
      newErrors.Address = 'Address is required';
    }

    if (!formData.DateOfBirth) {
      newErrors.DateOfBirth = 'Date of birth is required';
    }

    if (!formData.Gender) {
      newErrors.Gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // ✅ Debug: Xem user có gì
    console.log('👤 Full user object:', auth);
    console.log('🆔 Account ID:', auth?.accountId);
    console.log('🔑 All user keys:', auth ? Object.keys(auth) : 'auth is null');
    const accountId = auth?.accountId;
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    
    
    if (!accountId) {
      console.error('❌ Cannot find account ID in user object');
      alert('Account ID not found. Please login again.');
      setIsLoading(false);
      navigate('/signin');
      return;
    }

    console.log('✅ Using account ID:', accountId);

    try {
      const result = await createPersonalInfo(accountId, formData);
      setIsLoading(false);

      if (result?.success) {
        alert('Profile completed successfully!');
        navigate('/');
      } else {
        alert(result?.message || 'An error occurred while saving your information.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error:', error);
      alert('Failed to save profile. Please try again.');
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
                name="FullName"
                value={formData.FullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.FullName ? 'ftpi-input-error' : ''}
              />
              {errors.FullName && <span className="ftpi-error-text">{errors.FullName}</span>}
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
                name="Phone"
                value={formData.Phone}
                onChange={handleInputChange}
                placeholder="Enter your Phone number"
                className={errors.Phone ? 'ftpi-input-error' : ''}
              />
              {errors.Phone && <span className="ftpi-error-text">{errors.Phone}</span>}
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
                name="Address"
                value={formData.Address}
                onChange={handleInputChange}
                placeholder="Enter your street Address"
                className={errors.Address ? 'ftpi-input-error' : ''}
              />
              {errors.Address && <span className="ftpi-error-text">{errors.Address}</span>}
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
                name="DateOfBirth"
                value={formData.DateOfBirth}
                onChange={handleInputChange}
                className={errors.DateOfBirth ? 'ftpi-input-error' : ''}
              />
              {errors.DateOfBirth && <span className="ftpi-error-text">{errors.DateOfBirth}</span>}
            </div>

            <div className="ftpi-form-field">
              <label>
                <img src={GenderIcon} alt="Gender" className="ftpi-field-icon" />
                <span>Gender</span>
                <span className="ftpi-required">*</span>
              </label>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleInputChange}
                className={errors.Gender ? 'ftpi-input-error' : ''}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.Gender && <span className="ftpi-error-text">{errors.Gender}</span>}
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
