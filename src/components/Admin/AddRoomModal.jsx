import React, { useState } from 'react';
import '../../styles/Admin/RoomModal.css';

const AddRoomModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    floor: '',
    capacity: '',
    price: '',
    status: 'available'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onAdd(formData);
    setFormData({
      roomNumber: '',
      roomType: '',
      floor: '',
      capacity: '',
      price: '',
      status: 'available'
    });
  };

  return (
    <div className="admin-room-modal-overlay" onClick={onClose}>
      <div className="admin-room-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="admin-room-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="admin-room-modal-header">
          <h2 className="admin-room-modal-title">Thêm phòng mới</h2>
          <p className="admin-room-modal-subtitle">Nhập thông tin phòng mới vào hệ thống</p>
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
              <label className="admin-room-form-label">Giá phòng (VNĐ) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="500000"
                className="admin-room-form-input"
              />
            </div>
          </div>
        </div>

        <div className="admin-room-modal-footer">
          <button className="admin-room-modal-btn cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="admin-room-modal-btn submit" onClick={handleSubmit}>
            Thêm phòng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
