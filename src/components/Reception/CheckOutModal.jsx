import React, { useState, useEffect } from 'react';
import './CheckOutModal.css';
import SelectIcon from '../../assets/icons/SelectIcon.svg';
import UnselectIcon from '../../assets/icons/UnselectIcon.svg';
import HouseIcon from '../../assets/icons/HouseIcon.svg';

const CheckOutModal = ({ 
  isOpen = false,
  onClose = () => {},
  bookingData = {},
  preselectedRooms = [],
  onConfirm = () => {}
}) => {
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedRooms(preselectedRooms);
    }
  }, [isOpen, preselectedRooms]);

  if (!isOpen) return null;

  const { 
    guestName = '',
    bookingId = '',
    phone = '',
    nights = 0,
    rooms = []
  } = bookingData;

  const handleSelectAll = () => {
    setSelectedRooms(rooms.map((_, index) => index));
  };

  const handleDeselectAll = () => {
    setSelectedRooms([]);
  };

  const toggleRoomSelection = (index) => {
    setSelectedRooms(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const calculateTotal = () => {
    return selectedRooms.reduce((sum, index) => {
      return sum + (rooms[index]?.total || 0);
    }, 0);
  };

  const handleConfirm = () => {
    const selectedRoomData = selectedRooms.map(index => rooms[index]);
    onConfirm(selectedRoomData);
  };

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-modal-close" onClick={onClose}>×</button>
        
        <div className="checkout-modal-header">
          <h2 className="checkout-modal-title">Hóa đơn thanh toán</h2>
          <p className="checkout-modal-subtitle">Chọn phòng cần check-out và xác nhận thanh toán</p>
        </div>

        <div className="checkout-modal-content">
          {/* Guest Info */}
          <div className="checkout-modal-info-card">
            <div className="checkout-modal-info-grid">
              <div className="checkout-modal-info-item">
                <p className="checkout-modal-info-label">Khách hàng</p>
                <p className="checkout-modal-info-value">{guestName}</p>
              </div>
              <div className="checkout-modal-info-item">
                <p className="checkout-modal-info-label">Mã đơn</p>
                <p className="checkout-modal-info-value">{bookingId}</p>
              </div>
              <div className="checkout-modal-info-item">
                <p className="checkout-modal-info-label">Số điện thoại</p>
                <p className="checkout-modal-info-value">{phone}</p>
              </div>
              <div className="checkout-modal-info-item">
                <p className="checkout-modal-info-label">Thời gian lưu trú</p>
                <p className="checkout-modal-info-value">{nights} đêm</p>
              </div>
            </div>
          </div>

          {/* Room Selection */}
          <div className="checkout-modal-rooms-section">
            <div className="checkout-modal-rooms-header">
              <h3 className="checkout-modal-rooms-title">Chọn phòng check-out</h3>
              <div className="checkout-modal-room-actions">
                <button className="checkout-modal-action-btn" onClick={handleSelectAll}>
                  <img src={SelectIcon} alt="Select" className="checkout-modal-action-icon" />
                  Chọn tất cả
                </button>
                <button className="checkout-modal-action-btn outline" onClick={handleDeselectAll}>
                  <img src={UnselectIcon} alt="Unselect" className="checkout-modal-action-icon" />
                  Bỏ chọn
                </button>
              </div>
            </div>

            <div className="checkout-modal-rooms-list">
              {rooms.map((room, index) => {
                const isSelected = selectedRooms.includes(index);
                return (
                  <div 
                    key={index} 
                    className={`checkout-modal-room-card ${isSelected ? 'selected' : ''}`}
                  >
                    <button 
                      className="checkout-modal-room-checkbox"
                      onClick={() => toggleRoomSelection(index)}
                    >
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.33 6.42L5.83 9.92L11.67 3.5" stroke="white" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>

                    <div className="checkout-modal-room-content">
                      <div className="checkout-modal-room-header-row">
                        <div className="checkout-modal-room-number-badge">
                          <span>{room.number}</span>
                        </div>
                        <div className="checkout-modal-room-info-row">
                          <p className="checkout-modal-room-name">Phòng {room.number}</p>
                          <div className="checkout-modal-room-type-badge">{room.type}</div>
                        </div>
                      </div>

                      <div className="checkout-modal-room-charges">
                        {/* Room Charge */}
                        <div className="checkout-modal-charge-item main">
                          <div className="checkout-modal-charge-left">
                            <p className="checkout-modal-charge-label">Tiền phòng</p>
                            <p className="checkout-modal-charge-detail">
                              {room.pricePerNight.toLocaleString()} × {room.nights} đêm
                            </p>
                          </div>
                          <p className="checkout-modal-charge-amount">
                            {(room.pricePerNight * room.nights).toLocaleString()} VNĐ
                          </p>
                        </div>

                        {/* Services */}
                        {room.services && room.services.map((service, idx) => (
                          <div key={idx} className="checkout-modal-charge-item">
                            <p className="checkout-modal-service-name">{service.name}</p>
                            <p className="checkout-modal-service-amount">
                              {service.price.toLocaleString()} VNĐ
                            </p>
                          </div>
                        ))}

                        {/* Room Total */}
                        <div className="checkout-modal-charge-item total">
                          <p className="checkout-modal-total-label">Tổng phòng {room.number}</p>
                          <p className="checkout-modal-total-amount">
                            {room.total.toLocaleString()} VNĐ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="checkout-modal-divider"></div>

          {/* Total Summary */}
          <div className="checkout-modal-total-section">
            <div className="checkout-modal-total-info">
              <p className="checkout-modal-total-label-main">Tổng cộng</p>
              <p className="checkout-modal-total-rooms">{selectedRooms.length} phòng check-out</p>
            </div>
            <p className="checkout-modal-total-price">{calculateTotal().toLocaleString()} VNĐ</p>
          </div>

          {/* Actions */}
          <div className="checkout-modal-actions">
            <button className="checkout-modal-btn cancel" onClick={onClose}>
              Hủy
            </button>
            <button 
              className="checkout-modal-btn confirm" 
              onClick={handleConfirm}
              disabled={selectedRooms.length === 0}
            >
              Check-out {selectedRooms.length} phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutModal;
