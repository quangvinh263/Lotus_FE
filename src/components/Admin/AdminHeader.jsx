import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import { AuthContext } from '../../context/AuthContext';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleSignOut = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="admin-header">
      <div className="admin-header-container">
        <div className="admin-search-bar">
          <img 
            src={SearchIcon} 
            alt="Search" 
            className="admin-search-icon"
          />
          <input 
            type="text" 
            placeholder="Tìm kiếm" 
            className="admin-search-input"
          />
        </div>
        
        <div className="admin-user-section">
          <div className="admin-user-info">
            <div className="admin-avatar">
              <img 
                src={PersonIcon} 
                alt="User" 
                className="admin-person-icon"
              />
            </div>
            <span className="admin-user-role">Quản trị viên</span>
          </div>
          <button className="admin-signout-button" onClick={handleSignOut}>Đăng xuất</button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
