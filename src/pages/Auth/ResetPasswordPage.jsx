import React, { useState } from 'react';
import '../../styles/ResetPassword.css';
import { useNavigate, useLocation } from 'react-router-dom';
import LockIcon from '../../assets/icons/LockIcon.svg';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Call API to reset password
      console.log('Resetting password for:', email);
      console.log('New password:', formData.password);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Password reset successfully!');
      navigate('/signin');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rp-container">
      <div className="rp-card">
        <div className="rp-header">
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>
          {email && <p className="rp-email">for {email}</p>}
        </div>

        <form className="rp-form" onSubmit={handleSubmit}>
          <div className="rp-form-field">
            <label>
              <img src={LockIcon} alt="Lock" className="rp-field-icon" />
              <span>New Password</span>
              <span className="rp-required">*</span>
            </label>
            <div className="rp-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className={errors.password ? 'rp-input-error' : ''}
                disabled={isLoading}
              />
              <button
                type="button"
                className="rp-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="rp-error-text">{errors.password}</span>}
          </div>

          <div className="rp-form-field">
            <label>
              <img src={LockIcon} alt="Lock" className="rp-field-icon" />
              <span>Confirm Password</span>
              <span className="rp-required">*</span>
            </label>
            <div className="rp-password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter new password"
                className={errors.confirmPassword ? 'rp-input-error' : ''}
                disabled={isLoading}
              />
              <button
                type="button"
                className="rp-toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="rp-error-text">{errors.confirmPassword}</span>}
          </div>

          <div className="rp-password-requirements">
            <p>Password must contain:</p>
            <ul>
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
            </ul>
          </div>

          <div className="rp-actions">
            <button 
              type="submit" 
              className="rp-btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button 
              type="button" 
              className="rp-btn-back"
              onClick={() => navigate('/signin')}
              disabled={isLoading}
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;