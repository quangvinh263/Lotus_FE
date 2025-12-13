import RoomIcon from '../../assets/icons/RoomIcon.svg';
import PersonIcon from '../../assets/icons/PersonIcon.svg';
import PlusIcon from '../../assets/icons/PlusIcon.svg';
import './ServiceTable.css';

function ServiceTable({ rooms, onManageService }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const getServicesList = (services) => {
    if (!services || services.length === 0) return null;
    return services.map(s => s.name).join(', ');
  };

  return (
    <div className="st-wrapper">
      <table className="st-table">
        <thead className="st-thead">
          <tr className="st-header-row">
            <th className="st-th st-th-room">Phòng</th>
            <th className="st-th st-th-type">Loại phòng</th>
            <th className="st-th st-th-customer">Khách hàng</th>
            <th className="st-th st-th-checkin">Check-in</th>
            <th className="st-th st-th-checkout">Check-out</th>
            <th className="st-th st-th-services">Dịch vụ</th>
            <th className="st-th st-th-amount">Tổng tiền DV</th>
            <th className="st-th st-th-actions">Thao tác</th>
          </tr>
        </thead>
        <tbody className="st-tbody">
          {rooms.map((room) => (
            <tr key={room.id} className="st-row">
              <td className="st-td st-td-room">
                <div className="st-room-info">
                  <div className="st-room-icon-wrapper">
                    <img src={RoomIcon} alt="Room" className="st-room-icon" />
                  </div>
                  <span className="st-room-number">{room.id}</span>
                </div>
              </td>
              <td className="st-td st-td-type">
                <span className="st-room-type">{room.roomType}</span>
              </td>
              <td className="st-td st-td-customer">
                <div className="st-customer-info">
                  <div className="st-customer-avatar">
                    <img src={PersonIcon} alt="Customer" className="st-avatar-icon" />
                  </div>
                  <span className="st-customer-name">{room.customerName}</span>
                </div>
              </td>
              <td className="st-td st-td-date">
                <span className="st-date-text">{room.checkIn}</span>
              </td>
              <td className="st-td st-td-date">
                <span className="st-date-text">{room.checkOut}</span>
              </td>
              <td className="st-td st-td-services">
                <div className="st-services-badge">
                  {room.serviceCount || 0} dịch vụ
                </div>
              </td>
              <td className="st-td st-td-amount">
                <span className="st-amount-text">{formatCurrency(room.totalServiceAmount)}</span>
              </td>
              <td className="st-td st-td-actions">
                <button 
                  className="st-manage-btn"
                  onClick={() => onManageService(room)}
                >
                  <img src={PlusIcon} alt="Manage" className="st-btn-icon" />
                  <span className="st-btn-text">Quản lý</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceTable;
