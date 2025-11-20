import React, { useState } from 'react';
import './ServiceModal.css';

const AddServiceModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (formData.name && formData.price) {
      onAdd(formData);
      setFormData({ name: '', price: '', description: '' });
      onClose();
    }
  };

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="service-modal-header">
          <h2>Thêm dịch vụ mới</h2>
          <p>Nhập thông tin dịch vụ mới vào hệ thống</p>
        </div>

        <div className="service-modal-body">
          <div className="service-modal-field">
            <label>Tên dịch vụ *</label>
            <input
              type="text"
              placeholder="Nhập tên dịch vụ"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="service-modal-field">
            <label>Giá (VND) *</label>
            <input
              type="number"
              placeholder="50000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="service-modal-field">
            <label>Mô tả</label>
            <textarea
              placeholder="Nhập mô tả dịch vụ"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="service-modal-footer">
          <button className="service-modal-btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="service-modal-btn-submit" onClick={handleSubmit}>
            Thêm dịch vụ
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
