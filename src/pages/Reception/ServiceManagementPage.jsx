import { useState } from 'react';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import ServiceSearchBar from '../../components/Reception/ServiceSearchBar';
import ServiceTable from '../../components/Reception/ServiceTable';
import ServiceModal from '../../components/Reception/ServiceModal';
import './ServiceManagementPage.css';

function ServiceManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Sample active room data
  const [rooms] = useState([
    {
      id: '201',
      roomType: 'Deluxe Room',
      customerName: 'Nguyễn Văn An',
      checkIn: '01/11/2025',
      checkOut: '04/11/2025',
      services: [
        { name: 'Giặt ủi', price: 100000 },
        { name: 'Minibar', price: 100000 }
      ],
      totalServiceAmount: 200000
    },
    {
      id: '102',
      roomType: 'Superior Room',
      customerName: 'Trần Thị Bình',
      checkIn: '02/11/2025',
      checkOut: '05/11/2025',
      services: [],
      totalServiceAmount: 0
    },
    {
      id: '301',
      roomType: 'Executive Room',
      customerName: 'Lê Minh Châu',
      checkIn: '01/11/2025',
      checkOut: '06/11/2025',
      services: [
        { name: 'Ăn sáng phòng', price: 250000 },
        { name: 'Massage thư giãn', price: 500000 }
      ],
      totalServiceAmount: 750000
    },
    {
      id: '401',
      roomType: 'Grand Suite',
      customerName: 'Phạm Quốc Dũng',
      checkIn: '02/11/2025',
      checkOut: '05/11/2025',
      services: [
        { name: 'Ăn tối phòng', price: 400000 },
        { name: 'Minibar', price: 100000 },
        { name: 'Massage toàn thân', price: 700000 }
      ],
      totalServiceAmount: 1200000
    },
    {
      id: '203',
      roomType: 'Deluxe Room',
      customerName: 'Hoàng Thị Em',
      checkIn: '03/11/2025',
      checkOut: '06/11/2025',
      services: [
        { name: 'Giặt ủi', price: 50000 }
      ],
      totalServiceAmount: 50000
    }
  ]);

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
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleSaveServices = (roomId, services) => {
    // Update room services
    const totalAmount = services.reduce((sum, s) => sum + (s.price * s.quantity), 0);
    
    // In real app, would save to backend
    console.log('Save services for room', roomId, services, 'Total:', totalAmount);
    
    // TODO: Update rooms state with new services
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
          onSave={handleSaveServices}
        />
      )}
    </div>
  );
}

export default ServiceManagementPage;
