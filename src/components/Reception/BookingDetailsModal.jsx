import PersonIcon from '../../assets/icons/PersonIcon.svg';
import HouseIcon from '../../assets/icons/HouseIcon.svg';
import CalenderIcon from '../../assets/icons/CalenderIcon.svg';
import WalletIcon from '../../assets/icons/WalletIcon.svg';
import TickIcon from '../../assets/icons/TickIcon.svg';
import XSignIcon from '../../assets/icons/XSignIcon.svg';
import './BookingDetailsModal.css';

function BookingDetailsModal({ booking, onClose, onConfirm, onCancel }) {
  if (!booking) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { label: 'Chờ xác nhận', bg: '#FEF9C2', color: '#A65F00' },
      'confirmed': { label: 'Đã xác nhận', bg: '#DCFCE7', color: '#008236' },
      'checked-in': { label: 'Đã check-in', bg: '#DBEAFE', color: '#1447E6' },
      'completed': { label: 'Đã check-out', bg: '#F3F4F6', color: '#364153' },
      'cancelled': { label: 'Đã hủy', bg: '#FFE2E2', color: '#C10007' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div 
        className="bdm-status-badge" 
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.label}
      </div>
    );
  };

  const totalRooms = booking.rooms.reduce((sum, room) => sum + room.quantity, 0);

  return (
    <div className="bdm-overlay" onClick={onClose}>
      <div className="bdm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="bdm-close-button" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="#133E87" strokeWidth="1.33333" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="bdm-header">
          <h2 className="bdm-title">Chi tiết đặt phòng</h2>
          <p className="bdm-subtitle">Thông tin chi tiết đơn đặt phòng {booking.id}</p>
        </div>

        <div className="bdm-content">
          {/* Status and Date */}
          <div className="bdm-info-row">
            <div className="bdm-status-group">
              <span className="bdm-label">Trạng thái</span>
              {getStatusBadge(booking.status)}
            </div>
            <div className="bdm-date-group">
              <span className="bdm-label-right">Ngày tạo</span>
              <span className="bdm-value">{booking.bookingDate}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bdm-section">
            <div className="bdm-section-header">
              <img src={PersonIcon} alt="Customer" className="bdm-section-icon" />
              <h3 className="bdm-section-title">Thông tin khách hàng</h3>
            </div>
            <div className="bdm-info-grid">
              <div className="bdm-info-item">
                <span className="bdm-info-label">Họ và tên</span>
                <span className="bdm-info-value">{booking.customerName}</span>
              </div>
              <div className="bdm-info-item">
                <span className="bdm-info-label">Số điện thoại</span>
                <span className="bdm-info-value">{booking.phone}</span>
              </div>
              <div className="bdm-info-item">
                <span className="bdm-info-label">Email</span>
                <span className="bdm-info-value">{booking.email}</span>
              </div>
              <div className="bdm-info-item">
                <span className="bdm-info-label">Số khách</span>
                <span className="bdm-info-value">{booking.guestCount} người</span>
              </div>
            </div>
          </div>

          {/* Room Info */}
          <div className="bdm-section">
            <div className="bdm-section-header">
              <img src={HouseIcon} alt="Room" className="bdm-section-icon" />
              <h3 className="bdm-section-title">Thông tin phòng</h3>
            </div>
            <div className="bdm-room-details">
              {booking.rooms.map((room, index) => (
                <div key={index} className="bdm-room-item">
                  <div className="bdm-room-info">
                    <div className="bdm-room-type-badge">{room.type}</div>
                    <span className="bdm-room-quantity">x {room.quantity} phòng</span>
                  </div>
                  <span className="bdm-room-price">
                    {formatCurrency(room.price || booking.totalAmount / totalRooms / booking.nights)}/đêm
                  </span>
                </div>
              ))}
              <div className="bdm-room-calculation">
                <span className="bdm-calc-text">
                  {totalRooms} phòng × {booking.nights} đêm × {formatCurrency(booking.totalAmount / totalRooms / booking.nights)} =
                </span>
                <span className="bdm-calc-total">{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Stay Duration */}
          <div className="bdm-section">
            <div className="bdm-section-header">
              <img src={CalenderIcon} alt="Calendar" className="bdm-section-icon" />
              <h3 className="bdm-section-title">Thời gian lưu trú</h3>
            </div>
            <div className="bdm-stay-grid">
              <div className="bdm-info-item">
                <span className="bdm-info-label">Check-in</span>
                <span className="bdm-info-value">{booking.checkIn}</span>
              </div>
              <div className="bdm-info-item">
                <span className="bdm-info-label">Check-out</span>
                <span className="bdm-info-value">{booking.checkOut}</span>
              </div>
              <div className="bdm-info-item">
                <span className="bdm-info-label">Số đêm</span>
                <span className="bdm-info-value">{booking.nights} đêm</span>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bdm-total-section">
            <div className="bdm-total-content">
              <div className="bdm-total-label-group">
                <img src={WalletIcon} alt="Wallet" className="bdm-total-icon" />
                <span className="bdm-total-label">Tổng tiền</span>
              </div>
              <span className="bdm-total-amount">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bdm-actions">
            {booking.status === 'pending' && (
              <button className="bdm-btn bdm-btn-confirm" onClick={() => onConfirm(booking.id)}>
                <img src={TickIcon} alt="Confirm" className="bdm-btn-icon" />
                Xác nhận đơn
              </button>
            )}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button className="bdm-btn bdm-btn-cancel" onClick={() => onCancel(booking.id)}>
                <img src={XSignIcon} alt="Cancel" className="bdm-btn-icon" />
                Hủy đơn
              </button>
            )}
            <button className="bdm-btn bdm-btn-close" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsModal;
