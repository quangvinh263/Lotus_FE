import React, { useState } from 'react';
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

  // Sample room data
  const [roomList, setRoomList] = useState([
    {
      id: 1,
      roomNumber: 'P101',
      roomType: 'Superior',
      status: 'available',
      capacity: 2,
      price: 500000,
      floor: 1
    },
    {
      id: 2,
      roomNumber: 'P102',
      roomType: 'Deluxe',
      status: 'occupied',
      capacity: 2,
      price: 800000,
      floor: 1
    },
    {
      id: 3,
      roomNumber: 'P103',
      roomType: 'Executive',
      status: 'reserved',
      capacity: 4,
      price: 1500000,
      floor: 1
    },
    {
      id: 4,
      roomNumber: 'P201',
      roomType: 'Grand Suite',
      status: 'available',
      capacity: 2,
      price: 500000,
      floor: 2
    },
    {
      id: 5,
      roomNumber: 'P202',
      roomType: 'Lotus Suite',
      status: 'occupied',
      capacity: 4,
      price: 2500000,
      floor: 2
    },
    {
      id: 6,
      roomNumber: 'P203',
      roomType: 'Deluxe',
      status: 'available',
      capacity: 2,
      price: 800000,
      floor: 2
    },
    {
      id: 7,
      roomNumber: 'P301',
      roomType: 'Grand Suite',
      status: 'reserved',
      capacity: 4,
      price: 1500000,
      floor: 3
    },
    {
      id: 8,
      roomNumber: 'P302',
      roomType: 'Standard',
      status: 'occupied',
      capacity: 2,
      price: 500000,
      floor: 3
    }
  ]);

  // Sample room type data
  const [roomTypeList, setRoomTypeList] = useState([
    {
      id: 1,
      name: 'Superior',
      size: '25m²',
      bedType: '1 giường đôi',
      capacity: 2,
      price: 500000,
      totalRooms: 40,
      availableRooms: 12,
      description: 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản, phù hợp cho cặp đôi hoặc khách đi công tác.'
    },
    {
      id: 2,
      name: 'Deluxe',
      size: '35m²',
      bedType: '1 giường king',
      capacity: 2,
      price: 800000,
      totalRooms: 30,
      availableRooms: 8,
      description: 'Phòng cao cấp với không gian rộng rãi và view đẹp, trang bị nội thất hiện đại.'
    },
    {
      id: 3,
      name: 'Executive',
      size: '55m²',
      bedType: '1 giường king + 1 sofa bed',
      capacity: 4,
      price: 1500000,
      totalRooms: 20,
      availableRooms: 6,
      description: 'Căn hộ cao cấp với phòng khách riêng biệt, phòng ngủ rộng rãi và phòng tắm sang trọng.'
    },
    {
      id: 4,
      name: 'Grand Suite',
      size: '80m²',
      bedType: '1 giường king',
      capacity: 4,
      price: 2500000,
      totalRooms: 10,
      availableRooms: 2,
      description: 'Phòng VIP với thiết kế sang trọng bậc nhất, view toàn cảnh, dịch vụ butler 24/7.'
    },
    {
      id: 5,
      name: 'Lotus Suite',
      size: '55m²',
      bedType: '1 giường king + 1 sofa bed',
      capacity: 4,
      price: 3500000,
      totalRooms: 20,
      availableRooms: 6,
      description: 'Căn hộ cao cấp với phòng khách riêng biệt, phòng ngủ rộng rãi và phòng tắm sang trọng.'
    }
  ]);

  const handleAddRoom = (formData) => {
    const newRoom = {
      id: roomList.length + 1,
      roomNumber: formData.roomNumber,
      roomType: formData.roomType,
      status: formData.status || 'available',
      capacity: parseInt(formData.capacity),
      price: parseInt(formData.price),
      floor: parseInt(formData.floor)
    };
    setRoomList([...roomList, newRoom]);
    setShowAddModal(false);
  };

  const handleEditRoom = (id, formData) => {
    setRoomList(roomList.map(room => 
      room.id === id ? {
        ...room,
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        status: formData.status,
        capacity: parseInt(formData.capacity),
        floor: parseInt(formData.floor)
      } : room
    ));
    setShowEditModal(false);
    setSelectedRoom(null);
  };

  const handleDeleteRoom = (id) => {
    setRoomList(roomList.filter(room => room.id !== id));
    setShowDeleteModal(false);
    setSelectedRoom(null);
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
  const handleAddRoomType = (formData) => {
    const newRoomType = {
      id: roomTypeList.length + 1,
      ...formData,
      totalRooms: 0,
      availableRooms: 0
    };
    setRoomTypeList([...roomTypeList, newRoomType]);
    setShowAddRoomTypeModal(false);
  };

  const handleEditRoomType = (id, formData) => {
    setRoomTypeList(roomTypeList.map(rt => 
      rt.id === id ? { ...rt, ...formData } : rt
    ));
    setShowEditRoomTypeModal(false);
    setSelectedRoomType2(null);
  };

  const handleDeleteRoomType = (id) => {
    setRoomTypeList(roomTypeList.filter(rt => rt.id !== id));
    setShowDeleteRoomTypeModal(false);
    setSelectedRoomType2(null);
  };

  const openEditRoomTypeModal = (roomType) => {
    setSelectedRoomType2(roomType);
    setShowEditRoomTypeModal(true);
  };

  const openDeleteRoomTypeModal = (roomType) => {
    setSelectedRoomType2(roomType);
    setShowDeleteRoomTypeModal(true);
  };

  const stats = {
    total: roomList.length,
    available: roomList.filter(r => r.status === 'available').length,
    occupied: roomList.filter(r => r.status === 'occupied').length,
    reserved: roomList.filter(r => r.status === 'reserved').length
  };

  const roomTypeStats = {
    totalTypes: roomTypeList.length,
    totalRooms: roomTypeList.reduce((sum, rt) => sum + rt.totalRooms, 0),
    availableRooms: roomTypeList.reduce((sum, rt) => sum + rt.availableRooms, 0),
    averagePrice: roomTypeList.length > 0 
      ? Math.round(roomTypeList.reduce((sum, rt) => sum + rt.price, 0) / roomTypeList.length / 1000) + 'K'
      : '0K'
  };

  const roomTypes = ['Tất cả', 'Superior', 'Deluxe', 'Executive', 'Grand Suite', 'Lotus Suite'];

  const getStatusLabel = (status) => {
    const statusMap = {
      available: 'Trống',
      occupied: 'Đang ở',
      reserved: 'Đã đặt'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      available: '#00A63E',
      occupied: '#133E87',
      reserved: '#F0B100'
    };
    return colorMap[status] || '#133E87';
  };

  const filteredRooms = roomList.filter(room => {
    const matchesType = selectedRoomType === 'Tất cả' || room.roomType === selectedRoomType;
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

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

          {/* Room Cards Grid */}
          <div className="admin-room-list">
            {filteredRooms.map((room) => (
              <div key={room.id} className="admin-room-card">
                <div className="admin-room-card-header">
                  <div className="admin-room-card-info">
                    <h3 className="admin-room-number">{room.roomNumber}</h3>
                    <p className="admin-room-type">{room.roomType}</p>
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
                    <span className="admin-room-detail-text">Sức chứa: {room.capacity} người</span>
                  </div>
                  <div className="admin-room-detail-item">
                    <img src={MoneyIcon} alt="Price" className="admin-room-detail-icon" />
                    <span className="admin-room-detail-text">{room.price.toLocaleString('vi-VN')}đ/đêm</span>
                  </div>
                  <p className="admin-room-floor">Tầng: {room.floor}</p>
                </div>

                <div className="admin-room-card-actions">
                  <button className="admin-room-action-btn edit" onClick={() => openEditModal(room)}>
                    <img src={ModifyIcon} alt="Edit" className="admin-room-action-icon" />
                    <span>Sửa</span>
                  </button>
                  <button className="admin-room-action-btn delete" onClick={() => openDeleteModal(room)}>
                    <img src={DeleteIcon} alt="Delete" className="admin-room-action-icon" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                        <p className="admin-room-type-specs">{roomType.size} • {roomType.bedType}</p>
                      </div>
                      <div className="admin-room-type-price">
                        <p className="admin-room-type-price-value">{roomType.price.toLocaleString('vi-VN')}đ</p>
                        <p className="admin-room-type-price-unit">/đêm</p>
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
        room={selectedRoom} 
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
