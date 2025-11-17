import React, { useState } from 'react';
import './ChangePassword.css';
import LockIcon from '../assets/icons/LockIcon.svg';

const ChangePassword = () => {
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
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleOpenModal = () => {
    setShowModal(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePassword = () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    // TODO: Add API call to change password
    console.log('Changing password...', passwordData);
    
    // Simulate success
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    
    // Close modal after 2 seconds
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
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
              {message.text && (
                <div className={`cp-message cp-message-${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="cp-form-field">
                <label>Current Password</label>
                <div className="cp-input-wrapper">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="cp-toggle-password"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? 'Hide' : 'Show'}
                  </button>
                </div>
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
                  />
                  <button
                    type="button"
                    className="cp-toggle-password"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? 'Hide' : 'Show'}
                  </button>
                </div>
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
                  />
                  <button
                    type="button"
                    className="cp-toggle-password"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>

            <div className="cp-modal-actions">
              <button className="cp-btn-cancel" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="cp-btn-save" onClick={handleChangePassword}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
