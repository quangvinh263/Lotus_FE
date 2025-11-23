import React, { useState, useEffect } from 'react';
import './RoomModal.css';

const EditRoomModal = ({ isOpen, onClose, onUpdate, room }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    floor: '',
    capacity: '',
    status: 'available'
  });

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber || '',
        roomType: room.roomType || '',
        floor: room.floor || '',
        capacity: room.capacity || '',
        status: room.status || 'available'
      });
    }
  }, [room]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onUpdate(room.id, formData);
  };

  return (
    <div className="admin-room-modal-overlay" onClick={onClose}>
      <div className="admin-room-modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="admin-room-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="admin-room-modal-header">
          <h2 className="admin-room-modal-title">Chỉnh sửa phòng</h2>
          <p className="admin-room-modal-subtitle">Cập nhật thông tin phòng</p>
        </div>

        <div className="admin-room-modal-body">
          <div className="admin-room-form-container">
            <div className="admin-room-form-group">
              <label className="admin-room-form-label">Số phòng *</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="P101"
                className="admin-room-form-input"
              />
            </div>

            <div className="admin-room-form-group">
              <label className="admin-room-form-label">Loại phòng *</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="admin-room-form-select"
              >
                <option value="">Chọn loại phòng</option>
                <option value="Superior">Superior</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Executive">Executive</option>
                <option value="Grand Suite">Grand Suite</option>
                <option value="Lotus Suite">Lotus Suite</option>
              </select>
            </div>

            <div className="admin-room-form-row">
              <div className="admin-room-form-group">
                <label className="admin-room-form-label">Tầng *</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="1"
                  className="admin-room-form-input"
                />
              </div>

              <div className="admin-room-form-group">
                <label className="admin-room-form-label">Sức chứa *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="2"
                  className="admin-room-form-input"
                />
              </div>
            </div>

            <div className="admin-room-form-group">
              <label className="admin-room-form-label">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="admin-room-form-select"
              >
                <option value="available">Trống</option>
                <option value="occupied">Đang ở</option>
                <option value="reserved">Đã đặt</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
          </div>
        </div>

        <div className="admin-room-modal-footer">
          <button className="admin-room-modal-btn cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="admin-room-modal-btn submit" onClick={handleSubmit}>
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomModal;
