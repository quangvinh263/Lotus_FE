import React from 'react';
import '../../styles/Admin/RoomModal.css';

const DeleteRoomModal = ({ isOpen, onClose, onDelete, room }) => {
  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete(room.id);
  };

  return (
    <div className="admin-room-modal-overlay" onClick={onClose}>
      <div className="admin-room-modal-content delete-room-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-room-modal-header">
          <h2 className="admin-room-modal-title">Xác nhận xóa phòng</h2>
          <p className="admin-room-modal-subtitle">
            Bạn có chắc chắn muốn xóa phòng {room?.roomNumber}? Hành động này không thể hoàn tác
          </p>
        </div>

        <div className="admin-room-modal-footer">
          <button className="admin-room-modal-btn cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="admin-room-modal-btn delete" onClick={handleDelete}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoomModal;
