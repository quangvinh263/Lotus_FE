import SearchIcon from '../../assets/icons/SearchIcon.svg';
import './ServiceSearchBar.css';

function ServiceSearchBar({ searchQuery, onSearchChange, totalRooms }) {
  return (
    <div className="ssb-container">
      <div className="ssb-header">
        <h2 className="ssb-title">Danh sách phòng đang hoạt động</h2>
        <div className="ssb-badge">{totalRooms} phòng</div>
      </div>
      
      <div className="ssb-search-wrapper">
        <img src={SearchIcon} alt="Search" className="ssb-search-icon" />
        <input
          type="text"
          className="ssb-search-input"
          placeholder="Tìm theo số phòng, tên khách..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default ServiceSearchBar;
