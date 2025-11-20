import React from 'react';
import './RoomModal.css';

const DeleteRoomTypeModal = ({ isOpen, onClose, onDelete, roomType }) => {
  if (!isOpen || !roomType) return null;

  const handleDelete = () => {
    onDelete(roomType.id);
  };

  return (
    <div className="admin-room-modal-overlay" onClick={onClose}>
      <div className="admin-room-modal-content delete-room-type-modal" onClick={(e) => e.stopPropagation()}>
        <button className="admin-room-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="admin-room-modal-header">
          <h2 className="admin-room-modal-title">Xác nhận xóa phòng</h2>
        </div>

        <div className="admin-room-modal-body">
          <p className="admin-room-delete-text">
            Bạn có chắc chắn muốn xóa loại phòng <strong>{roomType.name}</strong>? 
            Tất cả phòng thuộc loại này cũng sẽ bị ảnh hưởng. Hành động này không thể hoàn tác
          </p>
        </div>
        <div className="admin-room-modal-footer">
            <button type="button" onClick={onClose} className="admin-room-modal-btn admin-room-modal-btn-cancel">
              Hủy
            </button>
            <button type="button" onClick={handleDelete} className="admin-room-modal-btn admin-room-modal-btn-delete">
              Xóa
            </button>
          </div>
      </div>
    </div>
  );
};

export default DeleteRoomTypeModal;
