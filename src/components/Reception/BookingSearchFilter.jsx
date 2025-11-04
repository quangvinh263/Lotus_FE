import SearchIcon from '../../assets/icons/SearchIcon.svg';
import './BookingSearchFilter.css';

function BookingSearchFilter({ searchQuery, onSearchChange, selectedStatus, onStatusChange, totalBookings }) {
  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'checked-in', label: 'Đang ở' },
    { value: 'completed', label: 'Đã hoàn tất' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const getStatusLabel = (value) => {
    const option = statusOptions.find(opt => opt.value === value);
    return option ? option.label : 'Tất cả';
  };

  return (
    <div className="bsf-container">
      <div className="bsf-search-group">
        <label className="bsf-label">Tìm kiếm</label>
        <div className="bsf-input-wrapper">
          <input
            type="text"
            className="bsf-input"
            placeholder="Tìm theo mã đơn, tên khách, SĐT, email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <img src={SearchIcon} alt="Search" className="bsf-search-icon" />
        </div>
      </div>

      <div className="bsf-filter-group">
        <label className="bsf-label">Trạng thái</label>
        <div className="bsf-select-wrapper">
          <select 
            className="bsf-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.value === 'all' ? totalBookings : totalBookings})
              </option>
            ))}
          </select>
          <svg className="bsf-select-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="#133E87" strokeOpacity="0.5" strokeWidth="1.33333" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default BookingSearchFilter;
