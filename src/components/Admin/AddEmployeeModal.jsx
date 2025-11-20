import React, { useState } from 'react';
import './EmployeeModal.css';

const AddEmployeeModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    position: '',
    email: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    onAdd(formData);
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      position: '',
      email: '',
      phone: ''
    });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Thêm nhân viên mới</h2>
          <p className="admin-modal-subtitle">Nhập thông tin nhân viên mới vào hệ thống</p>
        </div>

        <div className="admin-modal-body">
          <div className="admin-form-container">
            <div className="admin-form-group">
              <label className="admin-form-label">Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập username"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Mật khẩu *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Xác nhận mật khẩu *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Họ và tên *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Vị trí *</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="admin-form-select"
              >
                <option value="">Chọn vị trí</option>
                <option value="Lễ tân">Lễ tân</option>
                <option value="Quản lý">Quản lý</option>
                <option value="Kế toán">Kế toán</option>
                <option value="Bảo vệ">Bảo vệ</option>
                <option value="Phục vụ">Phục vụ</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@hotel.com"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0901234567"
                className="admin-form-input"
              />
            </div>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button className="admin-modal-btn cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="admin-modal-btn submit" onClick={handleSubmit}>
            Thêm nhân viên
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
