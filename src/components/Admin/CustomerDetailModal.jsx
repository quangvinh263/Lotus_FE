import React from 'react';
import './CustomerDetailModal.css';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import GenderIcon from '../../assets/icons/GenderIcon.svg';
import HotelIcon from '../../assets/icons/HotelIcon.svg';

const CustomerDetailModal = ({ isOpen, onClose, customer }) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="customer-detail-modal-overlay" onClick={onClose}>
      <div className="customer-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="customer-detail-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="customer-detail-modal-header">
          <h2>Chi tiết khách hàng</h2>
          <p>Thông tin chi tiết và lịch sử đặt phòng</p>
        </div>

        <div className="customer-detail-modal-content">
          <div className="customer-detail-info-section">
            <div className="customer-detail-name">
              <h3>{customer.name}</h3>
            </div>

            <div className="customer-detail-info-grid">
              <div className="customer-detail-info-item">
                <p className="customer-detail-label">CCCD</p>
                <div className="customer-detail-value-with-icon">
                  <img src={PersonIcon} alt="CCCD" />
                  <span>{customer.cccd}</span>
                </div>
              </div>

              <div className="customer-detail-info-item">
                <p className="customer-detail-label">Giới tính</p>
                <div className="customer-detail-value-with-icon">
                  <img src={GenderIcon} alt="Gender" />
                  <span>{customer.gender}</span>
                </div>
              </div>
            </div>
          </div>

          {customer.room && (
            <div className="customer-detail-stay-section">
              <div className="customer-detail-stay-header">
                <img src={HotelIcon} alt="Hotel" />
                <h4>Thông tin lưu trú hiện tại</h4>
              </div>

              <div className="customer-detail-stay-info">
                <div className="customer-detail-stay-item">
                  <p className="customer-detail-label">Phòng</p>
                  <p className="customer-detail-value">{customer.room} - {customer.roomType}</p>
                </div>

                <div className="customer-detail-stay-item">
                  <p className="customer-detail-label">Check-in</p>
                  <p className="customer-detail-value">{customer.checkIn || '08/11/2025'}</p>
                </div>

                <div className="customer-detail-stay-item full-width">
                  <p className="customer-detail-label">Check-out dự kiến</p>
                  <p className="customer-detail-value">{customer.checkOut || '12/11/2025'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
