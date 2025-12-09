import React, { useState } from 'react';
import '../../styles/ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import MailIcon from '../../assets/icons/MailIcon.svg';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../api/authApi';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
        const response = await forgotPassword(email);
        if (!response.success) {
          toast.error(response.message || 'Failed to send reset password email. Please try again.');
          return;
        }

      else {
            toast.success(response.message, {
          onClose: () => navigate("/signin"),
          autoClose: 2000, // thời gian toast hiển thị
        })
    }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send reset password email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
        <div className="fp-header">
          <h1>Forgot Password?</h1>
          <p>Enter your email address and get a link to reset your password</p>
        </div>

        <form className="fp-form" onSubmit={handleSubmit}>
          <div className="fp-form-field">
            <label>
              <img src={MailIcon} alt="Email" className="fp-field-icon" />
              <span>Email Address</span>
              <span className="fp-required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className={error ? 'fp-input-error' : ''}
              disabled={isLoading}
            />
            {error && <span className="fp-error-text">{error}</span>}
          </div>

          <div className="fp-actions">
            <button 
              type="submit" 
              className="fp-btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button 
              type="button" 
              className="fp-btn-back"
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

export default ForgotPasswordPage;