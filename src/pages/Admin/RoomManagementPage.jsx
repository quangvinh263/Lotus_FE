import React, { useState, useEffect } from 'react';
import { getRoomStatistics, searchRooms, deleteRoom, addRoom, updateRoom } from '../../api/roomApi';
import { getRoomTypeStatistics, getAllRoomTypes, addRoomType, deleteRoomType, updateRoomType } from '../../api/roomTypeApi';
import '../../styles/Admin/RoomManagementPage.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import AddRoomModal from '../../components/Admin/AddRoomModal';
import EditRoomModal from '../../components/Admin/EditRoomModal';
import DeleteRoomModal from '../../components/Admin/DeleteRoomModal';
import AddRoomTypeModal from '../../components/Admin/AddRoomTypeModal';
import EditRoomTypeModal from '../../components/Admin/EditRoomTypeModal';
import DeleteRoomTypeModal from '../../components/Admin/DeleteRoomTypeModal';
import PlusIcon from '../../assets/icons/PlusIcon.svg';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import SelectIcon from '../../assets/icons/SelectIcon.svg';
import PeopleIcon from '../../assets/icons/PeopleIcon.svg';
import MoneyIcon from '../../assets/icons/MoneyIcon.svg';
import ModifyIcon from '../../assets/icons/ModifyIcon.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import BedIcon from '../../assets/icons/BedIcon.png';

const RoomManagementPage = () => {
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'roomTypes'
  const [selectedRoomType, setSelectedRoomType] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [roomTypeSearchTerm, setRoomTypeSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAddRoomTypeModal, setShowAddRoomTypeModal] = useState(false);
  const [showEditRoomTypeModal, setShowEditRoomTypeModal] = useState(false);
  const [showDeleteRoomTypeModal, setShowDeleteRoomTypeModal] = useState(false);
  const [selectedRoomType2, setSelectedRoomType2] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    reserved: 0,
  });

  // Room list từ API
  const [roomList, setRoomList] = useState([]);

  // Room type list từ API
  const [roomTypeList, setRoomTypeList] = useState([]);

  const handleAddRoom = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate: Không được để trống
      if (!formData.roomNumber || !formData.roomNumber.trim()) {
        alert('Vui lòng nhập số phòng!');
        setIsLoading(false);
        return;
      }
      
      if (!formData.roomType) {
        alert('Vui lòng chọn loại phòng!');
        setIsLoading(false);
        return;
      }
      
      if (!formData.floor) {
        alert('Vui lòng nhập tầng!');
        setIsLoading(false);
        return;
      }
      
      // Validate: Số phòng phải bắt đầu bằng số tầng
      const floor = parseInt(formData.floor);
      const roomNumber = formData.roomNumber.trim();
      const firstDigit = roomNumber.charAt(0);
      
      if (firstDigit !== floor.toString()) {
        alert(`Số phòng phải bắt đầu bằng số tầng ${floor}. Ví dụ: ${floor}01, ${floor}02`);
        setIsLoading(false);
        return;
      }
      
      // Chuẩn bị data đúng format backend
      const roomData = {
        roomNumber: roomNumber,
        typeName: formData.roomType + ' Room', // "Superior" -> "Superior Room"
        floor: floor
      };
      const result = await addRoom(roomData);
      if (result.success) {
        alert(result.message || 'Thêm phòng thành công!');
        setShowAddModal(false);
        await fetchFilteredRooms();
        await fetchRoomStatistics();
      } else {
        alert(result.message || 'Không thể thêm phòng!');
      }
    } catch (err) {
      alert('Đã có lỗi xảy ra khi thêm phòng!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRoom = async (id, formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate: Không được để trống
      if (!formData.roomNumber || !formData.roomNumber.trim()) {
        alert('Vui lòng nhập số phòng!');
        setIsLoading(false);
        return;
      }
      
      if (!formData.roomType) {
        alert('Vui lòng chọn loại phòng!');
        setIsLoading(false);
        return;
      }
      
      if (!formData.floor) {
        alert('Vui lòng nhập tầng!');
        setIsLoading(false);
        return;
      }
      
      // Validate: Số phòng phải bắt đầu bằng số tầng
      const floor = parseInt(formData.floor);
      const roomNumber = formData.roomNumber.trim();
      const firstDigit = roomNumber.charAt(0);
      
      if (firstDigit !== floor.toString()) {
        alert(`Số phòng phải bắt đầu bằng số tầng ${floor}. Ví dụ: ${floor}01, ${floor}02`);
        setIsLoading(false);
        return;
      }
      
      // Chuẩn bị data đúng format backend
      const roomData = {
        roomNumber: roomNumber,
        typeName: formData.roomType + ' Room', // "Superior" -> "Superior Room"
        floor: floor,
        status: formData.status
      };
      
      const result = await updateRoom(id, roomData);
      
      if (result.success) {
        alert(result.message || 'Cập nhật phòng thành công!');
        setShowEditModal(false);
        setSelectedRoom(null);
        await fetchFilteredRooms();
        await fetchRoomStatistics();
      } else {
        alert(result.message || 'Không thể cập nhật phòng!');
      }
    } catch (err) {
      alert('Đã có lỗi xảy ra khi cập nhật phòng!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await deleteRoom(id);
      if (result.success) {
        alert(result.message || 'Xóa phòng thành công!');
        setShowDeleteModal(false);
        setSelectedRoom(null);
        await fetchFilteredRooms();
        await fetchRoomStatistics();
      } else {
        alert(result.message || 'Không thể xóa phòng!');
      }
    } catch (err) {
      alert('Đã có lỗi xảy ra khi xóa phòng!');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setShowEditModal(true);
  };

  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    setShowDeleteModal(true);
  };

  // Room Type CRUD handlers
  const handleAddRoomType = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate: Không được để trống
      if (!formData.name || !formData.name.trim()) {
        alert('Vui lòng nhập tên loại phòng!');
        setIsLoading(false);
        return;
      }
      
      if (!formData.capacity || formData.capacity <= 0) {
        alert('Vui lòng nhập sức chứa hợp lệ!');
        setIsLoading(false);
        return;
      }
      
      if (!formData.size || formData.size <= 0) {
        alert('Vui lòng nhập diện tích hợp lệ!');
        setIsLoading(false);
        return;
      }
      
      if (!formData.price || formData.price <= 0) {
        alert('Vui lòng nhập giá hợp lệ!');
        setIsLoading(false);
        return;
      }
      
      // Chuẩn bị data đúng format backend
      const roomTypeData = {
        roomTypeName: formData.name.trim() + ' Room', // "Deluxe" -> "Deluxe Room"
        capacity: parseInt(formData.capacity),
        square: parseFloat(formData.size),
        feature: formData.feature || '',
        viewing: formData.viewing || '',
        smoking: formData.smoking || false,
        description: formData.description || '',
        basePrice: parseInt(formData.price)
      };
      
      console.log('📤 Sending room type data:', roomTypeData);
      
      const result = await addRoomType(roomTypeData);
      
      if (result.success) {
        alert(result.message || 'Thêm loại phòng thành công!');
        setShowAddRoomTypeModal(false);
        await fetchAllRoomTypes();
        await fetchRoomTypeStatistics();
      } else {
        alert(result.message || 'Không thể thêm loại phòng!');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Đã có lỗi xảy ra khi thêm loại phòng!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRoomType = async (id, formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate: Không được để trống
      if (!formData.name || !formData.name.trim()) {
        alert('Vui lòng nhập tên loại phòng!');
        setIsLoading(false);
        return;
      }
      
      if (!formData.capacity || formData.capacity <= 0) {
        alert('Vui lòng nhập sức chứa hợp lệ!');
        setIsLoading(false);
        return;
      }
      
      if (!formData.size || formData.size <= 0) {
        alert('Vui lòng nhập diện tích hợp lệ!');
        setIsLoading(false);
        return;
      }
      
      if (!formData.price || formData.price <= 0) {
        alert('Vui lòng nhập giá hợp lệ!');
        setIsLoading(false);
        return;
      }
      
      // Chuẩn bị data đúng format backend
      const roomTypeData = {
        typeId: id,
        roomTypeName: formData.name.trim() + ' Room', // "Deluxe" -> "Deluxe Room"
        capacity: parseInt(formData.capacity),
        square: parseFloat(formData.size),
        feature: formData.feature || '',
        viewing: formData.viewing || '',
        smoking: formData.smoking || false,
        description: formData.description || '',
        basePrice: parseInt(formData.price)
      };
      
      console.log('📤 Sending update room type data:', roomTypeData);
      
      const result = await updateRoomType(id, roomTypeData);
      
      if (result.success) {
        alert(result.message || 'Cập nhật loại phòng thành công!');
        setShowEditRoomTypeModal(false);
        setSelectedRoomType2(null);
        await fetchAllRoomTypes();
        await fetchRoomTypeStatistics();
      } else {
        alert(result.message || 'Không thể cập nhật loại phòng!');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Đã có lỗi xảy ra khi cập nhật loại phòng!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoomType = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🗑️ Xóa loại phòng với ID:', id);
      
      const result = await deleteRoomType(id);
      
      if (result.success) {
        alert(result.message || 'Xóa loại phòng thành công!');
        setShowDeleteRoomTypeModal(false);
        setSelectedRoomType2(null);
        await fetchAllRoomTypes();
        await fetchRoomTypeStatistics();
      } else {
        alert(result.message || 'Không thể xóa loại phòng!');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Đã có lỗi xảy ra khi xóa loại phòng!');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditRoomTypeModal = (roomType) => {
    setSelectedRoomType2(roomType);
    setShowEditRoomTypeModal(true);
  };

  const openDeleteRoomTypeModal = (roomType) => {
    setSelectedRoomType2(roomType);
    setShowDeleteRoomTypeModal(true);
  };

  const fetchRoomStatistics = async () => {
    try {
      console.log("Đang gọi API getRoomStatistics...");

      const result = await getRoomStatistics();
      console.log("Kết quả từ API getRoomStatistics:", result);

      if (!result.success) {
        console.error("Lỗi từ API:", result.message);
        return;
      }

      const apiData = result.statistics;
      console.log("Dữ liệu statistics:", apiData);

      const mappedStats = {
        total: apiData.totalRooms || 0,
        available: apiData.availableRooms || 0,
        occupied: apiData.occupiedRooms || 0,
        reserved: apiData.bookedRooms || 0,
      };

      console.log("Stats sau khi map:", mappedStats);
      setStats(mappedStats);

    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu thống kê phòng:", error);
    }
  };

  const fetchRoomTypeStatistics = async () => {
    try {
      console.log("🔍 Đang gọi API getRoomTypeStatistics...");

      const result = await getRoomTypeStatistics();
      console.log("Kết quả từ API getRoomTypeStatistics:", result);

      if (!result.success) {
        console.error("Lỗi từ API:", result.message);
        return;
      }

      const apiData = result.statistics;
      console.log("Dữ liệu statistics:", apiData);

      // Format average price
      const formatPrice = (price) => {
        if (!price) return '0đ';
        return `${price.toLocaleString('vi-VN')}đ`;
      };

      const mappedStats = {
        totalTypes: apiData.roomTypeCount || 0,
        totalRooms: apiData.roomCount || 0,
        availableRooms: apiData.roomAvailableCount || 0,
        averagePrice: formatPrice(apiData.averagePrice || 0),
      };

      console.log("Stats sau khi map:", mappedStats);
      setRoomTypeStats(mappedStats);

    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu thống kê loại phòng:", error);
    }
  };

  const fetchAllRoomTypes = async () => {
    try {
      console.log("Đang gọi API getAllRoomTypes...");

      const result = await getAllRoomTypes();
      console.log("Kết quả từ API getAllRoomTypes:", result);

      if (!result.success) {
        console.error("Lỗi từ API:", result.message);
        return;
      }

      console.log("Danh sách loại phòng:", result.roomTypes);
      setRoomTypeList(result.roomTypes || []);

    } catch (error) {
      console.error("Lỗi khi fetch danh sách loại phòng:", error);
    }
  };

  const fetchFilteredRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Tạo filter params theo format backend
      const filterParams = {};
      
      // Thêm keyword (search roomNumber)
      if (searchTerm.trim()) {
        filterParams.keyword = searchTerm.trim();
      }
      
      // Thêm typeName (filter roomType) - Thêm " Room" ở cuối
      if (selectedRoomType !== 'Tất cả') {
        filterParams.typeName = selectedRoomType + ' Room'; // UI: "Superior" -> API: "Superior Room"
      }
      
      console.log('Đang lọc phòng với params:', filterParams);
      
      // Gọi API search với filter
      const result = await searchRooms(filterParams);
      
      if (result.success) {
        setRoomList(result.rooms || []);
        console.log('Kết quả lọc:', result.rooms);
        console.log('Số lượng phòng:', result.rooms?.length || 0);
      } else {
        setError(result.message);
        setRoomList([]);
      }
    } catch (err) {
      console.error('Lỗi filter rooms:', err);
      setError('Không thể lọc phòng');
      setRoomList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi API khi component mount hoặc khi chuyển sang tab rooms/roomTypes
  useEffect(() => {
    if (activeTab === 'rooms') {
      console.log("Tab 'rooms' active - Load data");
      fetchRoomStatistics();
      fetchFilteredRooms();
    } else if (activeTab === 'roomTypes') {
      console.log("📋 Tab 'roomTypes' active - Load room type data");
      fetchRoomTypeStatistics();
      fetchAllRoomTypes();
    }
  }, [activeTab]);

  // Tự động filter khi selectedRoomType hoặc searchTerm thay đổi
  useEffect(() => {
    if (activeTab === 'rooms') {
      console.log('Filter thay đổi - Gọi lại API');
      console.log('  ├─ selectedRoomType:', selectedRoomType);
      console.log('  └─ searchTerm:', searchTerm);
      
      const delayDebounce = setTimeout(() => {
        fetchFilteredRooms();
      }, 100); 

      return () => clearTimeout(delayDebounce);
    }
  }, [selectedRoomType, searchTerm, activeTab]);

  const [roomTypeStats, setRoomTypeStats] = useState({
    totalTypes: 0,
    totalRooms: 0,
    availableRooms: 0,
    averagePrice: '0K'
  });


  const roomTypes = ['Tất cả', 'Superior', 'Deluxe', 'Executive', 'Grand Suite', 'Lotus Suite'];

  const getStatusLabel = (status) => {
    const statusMap = {
      'Available': 'Trống',
      'Occupied': 'Đang ở',
      'Booked': 'Đã đặt',
      'Reserved': 'Đã đặt',
      'Maintenance': 'Bảo trì'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'Available': '#00A63E',
      'Occupied': '#133E87',
      'Booked': '#F0B100',
      'Reserved': '#F0B100',
      'Maintenance': '#E7000B'
    };
    return colorMap[status] || '#133E87';
  };

  const filteredRoomTypes = roomTypeList.filter(roomType => {
    const matchesSearch = roomType.name.toLowerCase().includes(roomTypeSearchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="admin-room-page">
      <AdminSidebar />
      <div className="admin-room-container">
        <AdminHeader />
        <div className="admin-room-main">
          {/* Selection Bar */}
          <div className="admin-room-selection-bar">
            <button 
              className={`admin-room-tab ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              Quản lý phòng
            </button>
            <button 
              className={`admin-room-tab ${activeTab === 'roomTypes' ? 'active' : ''}`}
              onClick={() => setActiveTab('roomTypes')}
            >
              Quản lý loại phòng
            </button>
          </div>

          {activeTab === 'rooms' ? (
            <>
              {/* Header */}
              <div className="admin-room-header">
                <div className="admin-room-header-text">
                  <h1 className="admin-room-title">Quản lý phòng</h1>
                  <p className="admin-room-subtitle">Quản lý thông tin và giá phòng</p>
                </div>
                <button className="admin-room-add-btn" onClick={() => setShowAddModal(true)}>
                  <img src={PlusIcon} alt="Add" className="admin-room-add-icon" />
                  <span>Thêm phòng</span>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="admin-room-stats">
            <div className="admin-room-stat-card">
              <p className="admin-room-stat-label">Tổng phòng</p>
              <h2 className="admin-room-stat-value">{stats.total}</h2>
            </div>
            <div className="admin-room-stat-card">
              <p className="admin-room-stat-label">Phòng trống</p>
              <h2 className="admin-room-stat-value" style={{ color: '#00A63E' }}>{stats.available}</h2>
            </div>
            <div className="admin-room-stat-card">
              <p className="admin-room-stat-label">Đang ở</p>
              <h2 className="admin-room-stat-value">{stats.occupied}</h2>
            </div>
            <div className="admin-room-stat-card">
              <p className="admin-room-stat-label">Đã đặt</p>
              <h2 className="admin-room-stat-value" style={{ color: '#F0B100' }}>{stats.reserved}</h2>
            </div>
          </div>

          {/* Room Type Filters */}
          <div className="admin-room-filters">
            {roomTypes.map((type) => (
              <button
                key={type}
                className={`admin-room-filter-btn ${selectedRoomType === type ? 'active' : ''}`}
                onClick={() => setSelectedRoomType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <div className="admin-room-search-bar">
            <div className="admin-room-search-container">
              <input
                type="text"
                placeholder="Tìm kiếm số phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-room-search-input"
              />
              <img src={SearchIcon} alt="Search" className="admin-room-search-icon" />
            </div>
          </div>

          {/* Room Cards Grid - Với Loading/Error States */}
          {isLoading ? (
            <div className="admin-room-loading" style={{ textAlign: 'center', padding: '40px' }}>
              <p>Đang tải danh sách phòng...</p>
            </div>
          ) : error ? (
            <div className="admin-room-error" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#E7000B', marginBottom: '16px' }}>{error}</p>
              <button 
                onClick={fetchFilteredRooms} 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#133E87',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Thử lại
              </button>
            </div>
          ) : roomList.length > 0 ? (
            <div className="admin-room-list">
              {roomList.map((room) => (
                <div key={room.roomId} className="admin-room-card">
                  <div className="admin-room-card-header">
                    <div className="admin-room-card-info">
                      <h3 className="admin-room-number">{room.roomNumber}</h3>
                      <p className="admin-room-type">{room.roomTypeName || 'N/A'}</p>
                    </div>
                    <div 
                      className="admin-room-status" 
                      style={{ backgroundColor: getStatusColor(room.status) }}
                    >
                      {getStatusLabel(room.status)}
                    </div>
                  </div>

                  <div className="admin-room-card-details">
                    <div className="admin-room-detail-item">
                      <img src={PeopleIcon} alt="Capacity" className="admin-room-detail-icon" />
                      <span className="admin-room-detail-text">
                        Sức chứa: {room.capacity || 0} người
                      </span>
                    </div>
                    <div className="admin-room-detail-item">
                      <img src={MoneyIcon} alt="Price" className="admin-room-detail-icon" />
                      <span className="admin-room-detail-text">
                        {(room.averagePrice || 0).toLocaleString('vi-VN')}đ/đêm
                      </span>
                    </div>
                    <p className="admin-room-floor">Tầng: {room.floor || 'N/A'}</p>
                  </div>

                  <div className="admin-room-card-actions">
                    <button 
                      className="admin-room-action-btn edit" 
                      onClick={() => openEditModal(room)}
                    >
                      <img src={ModifyIcon} alt="Edit" className="admin-room-action-icon" />
                      <span>Sửa</span>
                    </button>
                    <button 
                      className="admin-room-action-btn delete" 
                      onClick={() => openDeleteModal(room)}
                    >
                      <img src={DeleteIcon} alt="Delete" className="admin-room-action-icon" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-room-empty" style={{ textAlign: 'center', padding: '40px' }}>
              <p>Không tìm thấy phòng nào</p>
            </div>
          )}
            </>
          ) : (
            <>
              {/* Room Type Management Header */}
              <div className="admin-room-header">
                <div className="admin-room-header-text">
                  <h1 className="admin-room-title">Quản lý loại phòng</h1>
                  <p className="admin-room-subtitle">Quản lý các loại phòng và giá mặc định</p>
                </div>
                <button className="admin-room-add-btn" onClick={() => setShowAddRoomTypeModal(true)}>
                  <img src={PlusIcon} alt="Add" className="admin-room-add-icon" />
                  <span>Thêm loại phòng</span>
                </button>
              </div>

              {/* Room Type Stats Cards */}
              <div className="admin-room-stats">
                <div className="admin-room-stat-card">
                  <p className="admin-room-stat-label">Tổng loại phòng</p>
                  <h2 className="admin-room-stat-value">{roomTypeStats.totalTypes}</h2>
                </div>
                <div className="admin-room-stat-card">
                  <p className="admin-room-stat-label">Tổng phòng</p>
                  <h2 className="admin-room-stat-value">{roomTypeStats.totalRooms}</h2>
                </div>
                <div className="admin-room-stat-card">
                  <p className="admin-room-stat-label">Phòng trống</p>
                  <h2 className="admin-room-stat-value available">{roomTypeStats.availableRooms}</h2>
                </div>
                <div className="admin-room-stat-card">
                  <p className="admin-room-stat-label">Giá TB/đêm</p>
                  <h2 className="admin-room-stat-value">{roomTypeStats.averagePrice}</h2>
                </div>
              </div>

              {/* Search Bar */}
              <div className="admin-room-search">
                <img src={SearchIcon} alt="Search" className="admin-room-search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm loại phòng..."
                  className="admin-room-search-input"
                  value={roomTypeSearchTerm}
                  onChange={(e) => setRoomTypeSearchTerm(e.target.value)}
                />
              </div>

              {/* Room Type Cards Grid */}
              <div className="admin-room-type-grid">
                {filteredRoomTypes.map(roomType => (
                  <div key={roomType.id} className="admin-room-type-card">
                    <div className="admin-room-type-header">
                      <div className="admin-room-type-info">
                        <h3 className="admin-room-type-name">{roomType.name}</h3>
                        <p className="admin-room-type-specs">{roomType.size} • {roomType.feature || 'N/A'}</p>
                      </div>
                      <div className="admin-room-type-price">
                        <p className="admin-room-type-price-value">{roomType.price.toLocaleString('vi-VN')}đ</p>
                        <p className="admin-room-type-price-unit">/3 đêm</p>
                      </div>
                    </div>

                    <p className="admin-room-type-description">{roomType.description}</p>

                    <div className="admin-room-type-stats">
                      <div className="admin-room-type-stat">
                        <div className="admin-room-type-stat-header">
                          <img src={PeopleIcon} alt="Capacity" className="admin-room-type-stat-icon" />
                          <span className="admin-room-type-stat-label">Sức chứa</span>
                        </div>
                        <p className="admin-room-type-stat-value">{roomType.capacity} người</p>
                      </div>
                      <div className="admin-room-type-stat">
                        <div className="admin-room-type-stat-header">
                          <img src={BedIcon} alt="Total" className="admin-room-type-stat-icon" />
                          <span className="admin-room-type-stat-label">Tổng phòng</span>
                        </div>
                        <p className="admin-room-type-stat-value">{roomType.totalRooms}</p>
                      </div>
                      <div className="admin-room-type-stat">
                        <div className="admin-room-type-stat-header">
                          <img src={MoneyIcon} alt="Available" className="admin-room-type-stat-icon" />
                          <span className="admin-room-type-stat-label">Còn trống</span>
                        </div>
                        <p className="admin-room-type-stat-value available">{roomType.availableRooms}</p>
                      </div>
                    </div>

                    <div className="admin-room-type-actions">
                      <button className="admin-room-action-btn edit" onClick={() => openEditRoomTypeModal(roomType)}>
                        <img src={ModifyIcon} alt="Edit" className="admin-room-action-icon" />
                        <span>Chỉnh sửa</span>
                      </button>
                      <button className="admin-room-action-btn delete" onClick={() => openDeleteRoomTypeModal(roomType)}>
                        <img src={DeleteIcon} alt="Delete" className="admin-room-action-icon" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Room Modals */}
      <AddRoomModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={handleAddRoom} 
      />
      <EditRoomModal 
        isOpen={showEditModal} 
        onClose={() => { 
          setShowEditModal(false); 
          setSelectedRoom(null); 
        }} 
        onUpdate={handleEditRoom} 
        room={selectedRoom} 
      />
      <DeleteRoomModal 
        isOpen={showDeleteModal} 
        onClose={() => { 
          setShowDeleteModal(false); 
          setSelectedRoom(null); 
        }} 
        onDelete={handleDeleteRoom} 
        room={selectedRoom ? { ...selectedRoom, id: selectedRoom.roomId || selectedRoom.id } : null} 
      />

      {/* Room Type Modals */}
      <AddRoomTypeModal 
        isOpen={showAddRoomTypeModal} 
        onClose={() => setShowAddRoomTypeModal(false)} 
        onAdd={handleAddRoomType} 
      />
      <EditRoomTypeModal 
        isOpen={showEditRoomTypeModal} 
        onClose={() => { 
          setShowEditRoomTypeModal(false); 
          setSelectedRoomType2(null); 
        }} 
        onUpdate={handleEditRoomType} 
        roomType={selectedRoomType2} 
      />
      <DeleteRoomTypeModal 
        isOpen={showDeleteRoomTypeModal} 
        onClose={() => { 
          setShowDeleteRoomTypeModal(false); 
          setSelectedRoomType2(null); 
        }} 
        onDelete={handleDeleteRoomType} 
        roomType={selectedRoomType2} 
      />
    </div>
  );
};

export default RoomManagementPage;
