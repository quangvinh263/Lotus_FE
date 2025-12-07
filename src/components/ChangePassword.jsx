import React, { useState } from 'react';
import './ChangePassword.css';
import LockIcon from '../assets/icons/LockIcon.svg';
import { resetPassword } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const { auth } = React.useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleOpenModal = () => {
    setShowModal(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
      setMessage({ type: 'error', text: 'New passwords do not match' });
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase and number';
      setMessage({ type: 'error', text: 'Password must contain uppercase, lowercase and number' });
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      setMessage({ type: 'error', text: 'Please confirm your password' });
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      setMessage({ type: 'error', text: 'New passwords do not match' });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    if (!auth?.accountId) {
      toast.error('Account ID not found. Please login again.');
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        accountId: auth.accountId,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };
      
      console.log('data:', data);

      const response = await resetPassword(data);
      
      if (response.success) {
        toast.success(response.message || 'Password changed successfully!');
        // Close modal after 2 seconds
        setMessage({ type: 'success', text: 'Password changed successfully!' });
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="change-password-section">
        <div className="cp-header">
          <div className="cp-title-group">
            <img src={LockIcon} alt="Lock" className="cp-lock-icon" />
            <h2>Security</h2>
          </div>
          <button className="cp-btn-change" onClick={handleOpenModal}>
            Change Password
          </button>
        </div>
        <p className="cp-description">
          Keep your account secure by regularly updating your password
        </p>
      </div>

      {showModal && (
        <div className="cp-modal-overlay" onClick={handleCloseModal}>
          <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-header">
              <h3>Change Password</h3>
              <button className="cp-modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="cp-modal-content">
              <div className="cp-form-field">
                <label>Current Password</label>
                <div className="cp-input-wrapper">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    className={errors.currentPassword ? 'cp-input-error' : ''}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="cp-toggle-password"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.currentPassword && (
                  <span className="cp-error-text">{errors.currentPassword}</span>
                )}
              </div>

              <div className="cp-form-field">
                <label>New Password</label>
                <div className="cp-input-wrapper">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className={errors.newPassword ? 'cp-input-error' : ''}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="cp-toggle-password"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="cp-error-text">{errors.newPassword}</span>
                )}
              </div>

              <div className="cp-form-field">
                <label>Confirm New Password</label>
                <div className="cp-input-wrapper">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className={errors.confirmPassword ? 'cp-input-error' : ''}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="cp-toggle-password"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="cp-error-text">{errors.confirmPassword}</span>
                )}
              </div>

              <div className="cp-password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                </ul>
              </div>
            </div>

            <div className="cp-modal-actions">
              <button 
                className="cp-btn-cancel" 
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="cp-btn-save" 
                onClick={handleChangePassword}
                disabled={isLoading}
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
