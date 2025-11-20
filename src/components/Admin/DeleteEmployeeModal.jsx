import React from 'react';
import '../../styles/Admin/EmployeeModal.css';

const DeleteEmployeeModal = ({ isOpen, onClose, onDelete, employee }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete(employee.id);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Xác nhận xóa nhân viên</h2>
          <p className="admin-modal-subtitle">
            Bạn có chắc chắn muốn xóa nhân viên {employee?.name} ? Hành động này không thể hoàn tác
          </p>
        </div>

        <div className="admin-modal-footer">
          <button className="admin-modal-btn cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="admin-modal-btn delete" onClick={handleDelete}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeeModal;
