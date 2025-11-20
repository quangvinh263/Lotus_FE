import React from 'react';
import './ServiceModal.css';

const DeleteServiceModal = ({ isOpen, onClose, onDelete, service }) => {
  if (!isOpen || !service) return null;

  const handleDelete = () => {
    onDelete(service);
    onClose();
  };

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal service-modal-delete" onClick={(e) => e.stopPropagation()}>
        <div className="service-modal-header">
          <h2>Xác nhận xóa dịch vụ</h2>
          <p>
            Bạn có chắc chắn muốn xóa dịch vụ {service.name}? Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="service-modal-footer">
          <button className="service-modal-btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="service-modal-btn-delete" onClick={handleDelete}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteServiceModal;
