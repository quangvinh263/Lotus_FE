import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/SignIn.css';
import SignInImage from '../../assets/images/SignInImage.png';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    showPassword: false,
  });
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign in form submitted:', formData);
    
    // Set login state in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', formData.email.split('@')[0]); // Use email username as display name
    
    // After successful login, navigate to profile page
    navigate('/profile');
  };

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
    
    // Set login state in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'Google User');
    
    navigate('/profile');
  };

  const handleFacebookSignIn = () => {
    console.log('Sign in with Facebook');
    
    // Set login state in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'Facebook User');
    
    navigate('/profile');
  };

  const togglePasswordVisibility = () => {
    setFormData(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
    setResetMessage('');
    setForgotPasswordEmail('');
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setResetMessage('');
    setForgotPasswordEmail('');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setResetMessage('Please enter your email address');
      return;
    }
    
    // TODO: Call API to send reset password email
    console.log('Reset password for:', forgotPasswordEmail);
    setResetMessage('Password reset link has been sent to your email!');
    
    // Close modal after 2 seconds
    setTimeout(() => {
      handleCloseForgotPasswordModal();
    }, 2000);
  };

  return (
    <div className="signin-container">
      <div className="signin-left-panel">
        <img src={SignInImage} alt="Sign in illustration" className="signin-image" />
      </div>

      <div className="signin-right-panel">
        <div className="signin-card">
          <div className="signin-header">
            <h1 className="signin-title">Sign in</h1>
            <p className="signin-signup-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-fields">
              {/* Email Field */}
              <div className="signin-form-field">
                <label className="signin-field-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="signin-text-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>

              {/* Password Field */}
              <div className="signin-form-field">
                <label className="signin-field-label signin-password-label">
                  <span>Password</span>
                  <button
                    type="button"
                    className="signin-password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {formData.showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <input
                  type={formData.showPassword ? "text" : "password"}
                  name="password"
                  className="signin-text-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=""
                />
              </div>

              {/* Remember Me Checkbox and Forgot Password */}
              <div className="remember-me-checkbox">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <div className="forgot-password-link">
                  <button 
                    type="button" 
                    className="forgot-password-btn"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>

            {/* Sign In Button */}
            <button type="submit" className="signin-btn">
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="signin-divider">
            <div className="signin-divider-line"></div>
            <span className="signin-divider-text">OR</span>
            <div className="signin-divider-line"></div>
          </div>

          {/* Social Media Login */}
          <div className="signin-social-login">
            <button type="button" className="signin-social-btn google-btn" onClick={handleGoogleSignIn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 12.2331C22.5 11.3698 22.4291 10.7398 22.2782 10.0865H12.2188V13.9832H18.1199C18.0109 14.9515 17.3855 16.4098 15.9646 17.3898L15.9442 17.5203L19.0894 19.935L19.3109 19.9565C21.2855 18.1249 22.5 15.4298 22.5 12.2331Z" fill="#4285F4"/>
                <path d="M12.2188 22.5C15.1055 22.5 17.5164 21.5666 19.3109 19.9565L15.9646 17.3899C15.0518 18.0082 13.8373 18.4399 12.2188 18.4399C9.39458 18.4399 6.99732 16.6082 6.13368 14.0766L6.00887 14.0872L2.74098 16.5954L2.69727 16.7132C4.48095 20.2449 8.07641 22.5 12.2188 22.5Z" fill="#34A853"/>
                <path d="M6.13368 14.0766C5.92459 13.4233 5.80545 12.7233 5.80545 12C5.80545 11.2766 5.92459 10.5766 6.12459 9.92329L6.11913 9.78411L2.80773 7.23242L2.69727 7.28667C1.98095 8.71997 1.57227 10.3116 1.57227 12C1.57227 13.6883 1.98095 15.28 2.69727 16.7133L6.13368 14.0766Z" fill="#FBBC05"/>
                <path d="M12.2188 5.55997C14.2109 5.55997 15.5564 6.41163 16.3255 7.12335L19.3491 4.23C17.5073 2.54167 15.1055 1.5 12.2188 1.5C8.07641 1.5 4.48095 3.755 2.69727 7.28662L6.12459 9.92329C6.99732 7.39166 9.39458 5.55997 12.2188 5.55997Z" fill="#EB4335"/>
              </svg>
              Continue with Google
            </button>

            <button type="button" className="signin-social-btn facebook-btn" onClick={handleFacebookSignIn}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#0C82EE"/>
                <path d="M20 8H17.5C16.5717 8 15.6815 8.36875 15.0251 9.02513C14.3687 9.6815 14 10.5717 14 11.5V14H11.5V18H14V30H18V18H20.5L22 14H18V11.5C18 11.2348 18.1054 10.9804 18.2929 10.7929C18.4804 10.6054 18.7348 10.5 19 10.5H20V8Z" fill="white"/>
              </svg>
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="forgot-password-overlay" onClick={handleCloseForgotPasswordModal}>
          <div className="forgot-password-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseForgotPasswordModal}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="#133E87" strokeWidth="1.33" strokeLinecap="round"/>
              </svg>
            </button>

            <h2 className="modal-title">Forgot Password</h2>
            <p className="modal-description">
              Enter your email address and we'll send you a link to reset your password
            </p>

            <form className="modal-form" onSubmit={handleResetPassword}>
              <div className="modal-form-field">
                <label className="modal-field-label">Email</label>
                <input
                  type="email"
                  className="modal-text-input"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {resetMessage && (
                <p className={`reset-message ${resetMessage.includes('sent') ? 'success' : 'error'}`}>
                  {resetMessage}
                </p>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="modal-btn modal-btn-cancel"
                  onClick={handleCloseForgotPasswordModal}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn modal-btn-submit">
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
