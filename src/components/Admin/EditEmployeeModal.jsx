import React, { useState, useEffect } from 'react';
import './EmployeeModal.css';
import { updateEmployee } from '../../api/employeeApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditEmployeeModal = ({ isOpen, onClose, onUpdate, employee }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    position: '',
    email: '',
    phone: '',
    isactive: true
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.username || '',
        password: '',
        confirmPassword: '',
        fullName: employee.name || '',
        position: employee.position || '',
        email: employee.email || '',
        phone: employee.phone || '',
        isactive: employee.isActive !== undefined ? employee.isActive : true
      });
    }
  }, [employee]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async() => {
    if (
        !formData.username.trim() ||
        !formData.fullName.trim() ||
        !formData.position.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim()
      ) {
        toast.error('Vui lòng nhập đầy đủ tất cả các trường!');
        return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu không khớp!');
      return;
    }
    const payload = {
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phone,
      position: formData.position,
      isActive: formData.isactive
    };
    console.log("Payload gửi lên API:", payload);
    const result = await updateEmployee(employee.id, payload);
    if (result.success) {
      toast.success('Cập nhật nhân viên thành công!');
      onUpdate(payload);
      onClose();
      window.location.reload();
    } else {
      toast.error(result.message || 'Cập nhật nhân viên thất bại!');
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Chỉnh sửa nhân viên</h2>
          <p className="admin-modal-subtitle">Cập nhật thông tin nhân viên</p>
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
    
            <div className="admin-form-group"> 
              <label className="admin-form-label">Trạng thái hoạt động *</label>
              <select
                name="isactive"
                value={formData.isactive}
                onChange={e => setFormData({ ...formData, isactive: e.target.value === "true" })}
                className="admin-form-select"
              >
                <option value={true}>Hoạt động</option>
                <option value={false}>Không hoạt động</option>
              </select>
            </div>

          </div>
        </div>

        <div className="admin-modal-footer">
          <button className="admin-modal-btn cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="admin-modal-btn submit" onClick={handleSubmit}>
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
