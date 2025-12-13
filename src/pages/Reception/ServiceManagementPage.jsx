import { useState, useEffect } from 'react';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import ServiceSearchBar from '../../components/Reception/ServiceSearchBar';
import ServiceTable from '../../components/Reception/ServiceTable';
import ServiceModal from '../../components/Reception/ServiceModal';
import { getServiceOrder } from '../../api/serviceApi';
import './ServiceManagementPage.css';

function ServiceManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch service orders from API
  useEffect(() => {
    fetchServiceOrders();
  }, []);

  const fetchServiceOrders = async (keyword = '') => {
    setLoading(true);
    console.log('📤 Fetching service orders...', keyword ? `keyword: ${keyword}` : '');
    
    try {
      const searchParams = keyword ? { keyword } : {};
      const result = await getServiceOrder(searchParams);
      
      if (result.success) {
        console.log('📥 Service orders received:', result.orders);
        
        // Map API response to component format
        const mappedRooms = result.orders.map(order => ({
          id: order.roomNumber,
          reservationDetailId: order.reservationDetailId,
          roomType: order.roomType,
          customerName: order.customerName,
          checkIn: formatDate(order.checkInDate),
          checkOut: formatDate(order.checkOutDate),
          services: [], // Services will be loaded when modal opens
          serviceCount: order.serviceCount,
          totalServiceAmount: order.totalServiceAmount
        }));
        
        setRooms(mappedRooms);
      } else {
        console.error('❌ Failed to fetch service orders:', result.message);
        alert(result.message || 'Không thể tải danh sách phòng');
      }
    } catch (error) {
      console.error('❌ Error fetching service orders:', error);
      alert('Có lỗi xảy ra khi tải danh sách phòng');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const filteredRooms = rooms.filter(room => {
    if (searchQuery === '') return true;
    
    const query = searchQuery.toLowerCase();
    return (
      room.id.toLowerCase().includes(query) ||
      room.customerName.toLowerCase().includes(query) ||
      room.roomType.toLowerCase().includes(query)
    );
  });

  const handleManageService = (room) => {
    console.log('📋Opening service modal for room:', room);
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    // Refresh the room list after closing modal
    fetchServiceOrders();
  };

  return (
    <div className="smp-container">
      <Sidebar activePage="service-management" />
      <div className="smp-main">
        <TopBar />
        <div className="smp-content">
          <div className="smp-header">
            <h1 className="smp-title">Quản lý dịch vụ</h1>
            <p className="smp-description">Ghi nhận và cập nhật dịch vụ cho khách đang ở</p>
          </div>

          <div className="smp-card">
            <ServiceSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalRooms={filteredRooms.length}
            />
            <ServiceTable 
              rooms={filteredRooms}
              onManageService={handleManageService}
            />
          </div>
        </div>
      </div>

      {selectedRoom && (
        <ServiceModal
          room={selectedRoom}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ServiceManagementPage;
