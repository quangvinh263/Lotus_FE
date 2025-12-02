import React, { useState, useEffect } from 'react';
import './ServiceModal.css';
import { updateService } from '../../api/serviceApi';
import { toast } from 'react-toastify';

const EditServiceModal = ({ isOpen, onClose, onEdit, service }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        price: service.price ? service.price.toString().replace(/\D/g, '') : '',
        description: service.description || '',
      });
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleSubmit = () => {
    if (formData.name && formData.price) {
      const result = updateService(service.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
      });
      result.then((res) => {
        if (res.success) {
          onEdit(res.service);
          onClose();
          window.location.reload();
        } else {
          toast.error(res.message || 'Cập nhật dịch vụ thất bại.');
        }
      });
    }
    else {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
    }
  };

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal" onClick={(e) => e.stopPropagation()}>
        <button className="service-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="service-modal-header">
          <h2>Chỉnh sửa dịch vụ</h2>
          <p>Cập nhật thông tin dịch vụ</p>
        </div>

        <div className="service-modal-body">
          <div className="service-modal-field">
            <label>Tên dịch vụ *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="service-modal-field">
            <label>Giá (VND) *</label>
            <input
              type="number"
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
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;
