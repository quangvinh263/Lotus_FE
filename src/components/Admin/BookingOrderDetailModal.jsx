import React from 'react';
import '../../styles/Admin/BookingOrderDetailModal.css';

const BookingOrderDetailModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="booking-order-detail-overlay" onClick={onClose}>
      <div className="booking-order-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-order-detail-close" onClick={onClose}>
          ×
        </button>

        {/* Header */}
        <div className="booking-order-detail-header">
          <h2 className="booking-order-detail-title">Chi tiết đơn đặt phòng</h2>
          <p className="booking-order-detail-subtitle">Thông tin chi tiết về đơn đặt phòng</p>
        </div>

        {/* Content */}
        <div className="booking-order-detail-content">
          {/* Booking ID and Status */}
          <div className="booking-order-detail-id-section">
            <div className="booking-order-detail-id-wrapper">
              <p className="booking-order-detail-label">Mã đơn đặt phòng</p>
              <h3 className="booking-order-detail-id">{booking.id}</h3>
            </div>
            <div 
              className="booking-order-detail-status-badge"
              style={{ backgroundColor: booking.statusColor }}
            >
              {booking.statusText}
            </div>
          </div>

          {/* Customer Information */}
          <div className="booking-order-detail-section">
            <h4 className="booking-order-detail-section-title">Thông tin khách hàng</h4>
            <div className="booking-order-detail-info-grid">
              <div className="booking-order-detail-info-item">
                <p className="booking-order-detail-label">Họ tên</p>
                <p className="booking-order-detail-value">{booking.customerName}</p>
              </div>
              <div className="booking-order-detail-info-item">
                <p className="booking-order-detail-label">Số điện thoại</p>
                <p className="booking-order-detail-value">{booking.phone}</p>
              </div>
              <div className="booking-order-detail-info-item">
                <p className="booking-order-detail-label">Email</p>
                <p className="booking-order-detail-value">{booking.email || 'nvana@gmail.com'}</p>
              </div>
            </div>
          </div>

          {/* Room and Stay Information */}
          <div className="booking-order-detail-two-column">
            {/* Room Information */}
            <div className="booking-order-detail-box">
              <h4 className="booking-order-detail-section-title">Thông tin phòng</h4>
              <div className="booking-order-detail-info-list">
                <div className="booking-order-detail-info-item">
                  <p className="booking-order-detail-label">Số phòng</p>
                  <p className="booking-order-detail-value">{booking.roomCount}</p>
                </div>
                <div className="booking-order-detail-info-item">
                  <p className="booking-order-detail-label">Số khách</p>
                  <p className="booking-order-detail-value">2 người</p>
                </div>
              </div>
            </div>

            {/* Stay Duration */}
            <div className="booking-order-detail-box">
              <h4 className="booking-order-detail-section-title">Thời gian lưu trú</h4>
              <div className="booking-order-detail-info-list">
                <div className="booking-order-detail-info-item">
                  <p className="booking-order-detail-label">Check-in</p>
                  <p className="booking-order-detail-value">{booking.checkIn}</p>
                </div>
                <div className="booking-order-detail-info-item">
                  <p className="booking-order-detail-label">Check-out dự kiến</p>
                  <p className="booking-order-detail-value">{booking.checkOut}</p>
                </div>
                <div className="booking-order-detail-info-item">
                  <p className="booking-order-detail-label">Số đêm</p>
                  <p className="booking-order-detail-value">{booking.nights} đêm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="booking-order-detail-section">
            <h4 className="booking-order-detail-section-title">Thông tin thanh toán</h4>
            <div className="booking-order-detail-payment">
              <div className="booking-order-detail-payment-row">
                <span className="booking-order-detail-payment-label">Tổng tiền:</span>
                <span className="booking-order-detail-payment-value">
                  {booking.totalAmount?.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="booking-order-detail-payment-row">
                <span className="booking-order-detail-payment-label">Đã đặt cọc:</span>
                <span className="booking-order-detail-payment-value">
                  {booking.depositAmount?.toLocaleString('vi-VN') || '500,000'}đ
                </span>
              </div>
              <div className="booking-order-detail-payment-row">
                <span className="booking-order-detail-payment-label">Đã thanh toán thêm:</span>
                <span className="booking-order-detail-payment-value">
                  {booking.paidAmount?.toLocaleString('vi-VN') || '0'}đ
                </span>
              </div>
              <div className="booking-order-detail-payment-row border-top">
                <span className="booking-order-detail-payment-label-bold">Còn lại:</span>
                <span className="booking-order-detail-payment-value">
                  {booking.remainingAmount?.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="booking-order-detail-payment-row">
                <span className="booking-order-detail-payment-label">Trạng thái:</span>
                <span 
                  className="booking-order-detail-payment-status"
                  style={{ color: booking.paymentStatusColor }}
                >
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="booking-order-detail-actions">
            <button className="booking-order-detail-btn" onClick={onClose}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingOrderDetailModal;
