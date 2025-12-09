import PhoneIcon from '../../assets/icons/PhoneIcon.svg';
import MailIcon from '../../assets/icons/MailIcon.svg';
import CalenderIcon from '../../assets/icons/CalenderIcon.svg';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import EyeIcon from '../../assets/icons/EyeIcon.svg';
import TickIcon from '../../assets/icons/TickIcon.svg';
import XSignIcon from '../../assets/icons/XSignIcon.svg';
import './BookingTable.css';

function BookingTable({ bookings, onViewBooking, onConfirmBooking, onCancelBooking }) {
  const getStatusBadge = (status) => {
    // Map backend status to display config
    const normalizedStatus = status?.toLowerCase();
    const statusConfig = {
      'pending': { label: 'Chờ xác nhận', bg: '#FEF9C2', color: '#A65F00' },
      'confirmed': { label: 'Đã xác nhận', bg: '#DCFCE7', color: '#008236' },
      'inhouse': { label: 'Đang ở', bg: '#DBEAFE', color: '#1447E6' },
      'completed': { label: 'Hoàn thành', bg: '#F3F4F6', color: '#364153' },
      'cancelled': { label: 'Đã hủy', bg: '#FFE2E2', color: '#C10007' }
    };

    const config = statusConfig[normalizedStatus] || statusConfig.pending;

    return (
      <div 
        className="bt-status-badge" 
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.label}
      </div>
    );
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  return (
    <div className="bt-container">
      <table className="bt-table">
        <thead className="bt-thead">
          <tr className="bt-header-row">
            <th className="bt-th bt-th-code">Mã đơn</th>
            <th className="bt-th bt-th-customer">Khách hàng</th>
            <th className="bt-th bt-th-contact">Liên hệ</th>
            <th className="bt-th bt-th-rooms">Phòng</th>
            <th className="bt-th bt-th-dates">Check-in/out</th>
            <th className="bt-th bt-th-amount">Tổng tiền</th>
            <th className="bt-th bt-th-status">Trạng thái</th>
            <th className="bt-th bt-th-actions">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bt-tbody">
          {bookings.map((booking, index) => (
            <tr key={booking.id} className="bt-row">
              <td className="bt-td bt-td-code">
                <div className="bt-code-info">
                  <div className="bt-code">{booking.id}</div>
                  <div className="bt-booking-date">{formatDate(booking.bookingDate)}</div>
                </div>
              </td>
              <td className="bt-td bt-td-customer">
                <div className="bt-customer-info">
                  <div className="bt-avatar">
                    <img src={PersonIcon} alt="Avatar" className="bt-avatar-icon" />
                  </div>
                  <div className="bt-customer-details">
                    <div className="bt-customer-name">{booking.customerName}</div>
                    <div className="bt-guest-count">{booking.guestCount} người</div>
                  </div>
                </div>
              </td>
              <td className="bt-td bt-td-contact">
                <div className="bt-contact-info">
                  <div className="bt-contact-item">
                    <img src={PhoneIcon} alt="Phone" className="bt-contact-icon" />
                    <span className="bt-contact-text">{booking.phone}</span>
                  </div>
                  <div className="bt-contact-item">
                    <img src={MailIcon} alt="Email" className="bt-contact-icon" />
                    <span className="bt-contact-text">{booking.email}</span>
                  </div>
                </div>
              </td>
              <td className="bt-td bt-td-rooms">
                <div className="bt-rooms-info">
                  {booking.rooms && booking.rooms.length > 0 ? (
                    <>
                      {booking.rooms.map((room, idx) => (
                        <div key={idx} className="bt-room-badge">
                          {room.type} x{room.quantity}
                        </div>
                      ))}
                      <div className="bt-room-total">
                        {booking.roomCount || booking.rooms.reduce((sum, room) => sum + room.quantity, 0)} phòng • {booking.guestCount} người
                      </div>
                    </>
                  ) : (
                    <div className="bt-room-total">
                      {booking.roomCount || 0} phòng • {booking.guestCount} người
                    </div>
                  )}
                </div>
              </td>
              <td className="bt-td bt-td-dates">
                <div className="bt-dates-info">
                  <div className="bt-date-item">
                    <img src={CalenderIcon} alt="Check-in" className="bt-date-icon" />
                    <span className="bt-date-text">{booking.checkIn}</span>
                  </div>
                  <div className="bt-date-item">
                    <img src={CalenderIcon} alt="Check-out" className="bt-date-icon" />
                    <span className="bt-date-text">{booking.checkOut}</span>
                  </div>
                  <div className="bt-nights">{booking.nights} đêm</div>
                </div>
              </td>
              <td className="bt-td bt-td-amount">
                <div className="bt-amount">{formatCurrency(booking.totalAmount)}</div>
              </td>
              <td className="bt-td bt-td-status">
                {getStatusBadge(booking.status)}
              </td>
              <td className="bt-td bt-td-actions">
                <div className="bt-actions">
                  <button 
                    className="bt-action-btn bt-action-view"
                    onClick={() => onViewBooking(booking)}
                    title="Xem chi tiết"
                  >
                    <img src={EyeIcon} alt="View" />
                  </button>
                  {(booking.status?.toLowerCase() === 'pending' || booking.status?.toLowerCase() === 'confirmed') && (
                    <button 
                      className="bt-action-btn bt-action-cancel"
                      onClick={() => onCancelBooking(booking.id)}
                      title="Hủy đơn"
                    >
                      <img src={XSignIcon} alt="Cancel" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingTable;
