import React, { useState } from 'react';
import './RoomModal.css';

const AddRoomTypeModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    capacity: '',
    size: '',
    feature: '',
    viewing: '',
    smoking: false,
    description: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      price: parseInt(formData.price),
      capacity: parseInt(formData.capacity),
      size: parseFloat(formData.size),
      feature: formData.feature,
      viewing: formData.viewing,
      smoking: formData.smoking,
      description: formData.description
    });
    // Reset form
    setFormData({
      name: '',
      price: '',
      capacity: '',
      size: '',
      feature: '',
      viewing: '',
      smoking: false,
      description: ''
    });
  };

  return (
    <div className="admin-room-modal-overlay" onClick={onClose}>
      <div className="admin-room-modal-content admin-room-type-modal" onClick={(e) => e.stopPropagation()}>
        <button className="admin-room-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="admin-room-modal-header">
          <h2 className="admin-room-modal-title">Thêm loại phòng</h2>
          <p className="admin-room-modal-subtitle">Nhập thông tin chi tiết loại phòng</p>
        </div>

        <div className="admin-room-modal-body">
          <form onSubmit={handleSubmit} className="admin-room-form-container">
            <div className="admin-room-form-group">
              <label className="admin-room-form-label">Tên loại phòng *</label>
              <input
                type="text"
                name="name"
                placeholder="Standard"
                value={formData.name}
                onChange={handleChange}
                className="admin-room-form-input"
                required
              />
            </div>

            <div className="admin-room-form-row">
              <div className="admin-room-form-group">
                <label className="admin-room-form-label">Giá mặc định (VNĐ) *</label>
                <input
                  type="number"
                  name="price"
                  placeholder="500000"
                  value={formData.price}
                  onChange={handleChange}
                  className="admin-room-form-input"
                  required
                />
              </div>
              <div className="admin-room-form-group">
                <label className="admin-room-form-label">Số khách tối đa *</label>
                <input
                  type="number"
                  name="capacity"
                  placeholder="2"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="admin-room-form-input"
                  required
                />
              </div>
            </div>

            <div className="admin-room-form-group">
              <label className="admin-room-form-label">Diện tích (m²) *</label>
              <input
                type="number"
                name="size"
                placeholder="25"
                value={formData.size}
                onChange={handleChange}
                className="admin-room-form-input"
                required
              />
            </div>

            <div className="admin-room-form-group">
              <label className="admin-room-form-label">Đặc điểm</label>
              <input
                type="text"
                name="feature"
                placeholder="1 giường đôi, wifi miễn phí..."
                value={formData.feature}
                onChange={handleChange}
                className="admin-room-form-input"
              />
            </div>

            <div className="admin-room-form-group">
              <label className="admin-room-form-label">View</label>
              <input
                type="text"
                name="viewing"
                placeholder="View biển, view thành phố..."
                value={formData.viewing}
                onChange={handleChange}
                className="admin-room-form-input"
              />
            </div>

            <div className="admin-room-form-group">
              <label className="admin-room-form-label">
                <input
                  type="checkbox"
                  name="smoking"
                  checked={formData.smoking}
                  onChange={(e) => setFormData(prev => ({ ...prev, smoking: e.target.checked }))}
                  style={{ marginRight: '8px' }}
                />
                Cho phép hút thuốc
              </label>
            </div>

            <div className="admin-room-form-group">
              <label className="admin-room-form-label">Mô tả</label>
              <textarea
                name="description"
                placeholder="Mô tả chi tiết về loại phòng..."
                value={formData.description}
                onChange={handleChange}
                className="admin-room-form-textarea"
                rows="3"
              />
            </div>

            <div className="admin-room-modal-footer" style={{ padding: 0 }}>
              <button type="button" onClick={onClose} className="admin-room-modal-btn admin-room-modal-btn-cancel">
                Hủy
              </button>
              <button type="submit" className="admin-room-modal-btn admin-room-modal-btn-submit">
                Thêm loại phòng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoomTypeModal;
