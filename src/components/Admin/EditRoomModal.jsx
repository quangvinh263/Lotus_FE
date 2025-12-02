import React, { useState, useEffect } from 'react';
import './RoomModal.css';

const EditRoomModal = ({ isOpen, onClose, onUpdate, room }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    floor: '',
    status: 'Available'
  });

  useEffect(() => {
    if (room) {
      // Map từ backend format sang UI format
      let roomTypeName = room.roomTypeName || room.roomType || '';
      // Bỏ chữ " Room" nếu có
      if (roomTypeName.endsWith(' Room')) {
        roomTypeName = roomTypeName.replace(' Room', '');
      }

      setFormData({
        roomNumber: room.roomNumber || '',
        roomType: roomTypeName,
        floor: room.floor || '',
        status: room.status || 'Available'
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
    // Validate: Không được để trống
    if (!formData.roomNumber || !formData.roomNumber.trim()) {
      alert('Vui lòng nhập số phòng!');
      return;
    }
    
    if (!formData.roomType) {
      alert('Vui lòng chọn loại phòng!');
      return;
    }
    
    if (!formData.floor) {
      alert('Vui lòng nhập tầng!');
      return;
    }
    
    // Validate: Số phòng phải bắt đầu bằng số tầng
    const floor = parseInt(formData.floor);
    const roomNumber = formData.roomNumber.trim();
    const firstDigit = roomNumber.charAt(0);
    
    if (firstDigit !== floor.toString()) {
      alert(`Số phòng phải bắt đầu bằng số tầng ${floor}. Ví dụ: ${floor}01, ${floor}02`);
      return;
    }

    // Gọi hàm update từ parent
    onUpdate(room.roomId || room.id, formData);
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
              <label className="admin-room-form-label">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="admin-room-form-select"
              >
                <option value="Available">Trống</option>
                <option value="Occupied">Đang ở</option>
                <option value="Booked">Đã đặt</option>
                <option value="Maintenance">Bảo trì</option>
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
