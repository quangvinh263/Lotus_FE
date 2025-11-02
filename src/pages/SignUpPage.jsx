import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/SignUp.css';
import SignUpImage from '../assets/images/SignUpImage.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    
    // Set login state in localStorage after successful signup
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', formData.username || formData.email.split('@')[0]);
    
    // After successful signup, navigate to profile page
    navigate('/profile');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-content">
          <div className="signup-form-section">
            <div className="signup-header">
              <h1 className="signup-title">Create an account</h1>
              <p className="signup-login-link">
                Already have an account? <Link to="/signin">Sign in</Link>
              </p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="signup-form-fields">
                {/* Username Field */}
                <div className="signup-form-field">
                  <label className="signup-field-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="signup-text-input"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>

                {/* Email Field */}
                <div className="signup-form-field">
                  <label className="signup-field-label">Email address</label>
                  <input
                    type="email"
                    name="email"
                    className="signup-text-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=""
                  />
                </div>

                {/* Password Fields */}
                <div className="password-section">
                  <div className="password-fields">
                    <div className="signup-form-field password-field">
                      <label className="signup-field-label">Password</label>
                      <input
                        type={formData.showPassword ? "text" : "password"}
                        name="password"
                        className="signup-text-input"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder=""
                      />
                    </div>

                    <div className="signup-form-field password-field">
                      <label className="signup-field-label">Confirm your password</label>
                      <input
                        type={formData.showPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="signup-text-input"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder=""
                      />
                    </div>
                  </div>

                  <p className="password-hint">
                    Use 8 or more characters with a mix of letters, numbers & symbols
                  </p>

                  <div className="show-password-checkbox">
                    <input
                      type="checkbox"
                      id="showPassword"
                      name="showPassword"
                      checked={formData.showPassword}
                      onChange={handleChange}
                    />
                    <label htmlFor="showPassword">Show password</label>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="cta-section">
                <button type="button" className="signin-instead-btn">
                  Sign in instead
                </button>
                <button type="submit" className="create-account-btn">
                  Create an account
                </button>
              </div>
            </form>
          </div>

          {/* Illustration Section */}
          <div className="signup-illustration">
            <div className="illustration-placeholder">
              <img src={SignUpImage} alt="Sign up illustration" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
