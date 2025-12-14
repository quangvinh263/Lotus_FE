import { useState } from 'react';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import CreateBookingForm from '../../components/Reception/CreateBookingForm';
import BookingSummaryCard from '../../components/Reception/BookingSummaryCard';
import './CreateBookingPage.css';

function CreateBookingPage() {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  const handleAddRoom = (room) => {
    setSelectedRooms([...selectedRooms, room]);
  };

  const handleRemoveRoom = (index) => {
    setSelectedRooms(selectedRooms.filter((_, i) => i !== index));
  };

  const calculateTotalGuests = () => {
    return selectedRooms.reduce((total, room) => total + room.guestsPerRoom, 0);
  };

  const calculateTotalRooms = () => {
    return selectedRooms.length;
  };

  return (
    <div className="create-booking-page">
      <Sidebar activePage="create-booking" />
      <div className="create-booking-main">
        <TopBar />
        <div className="create-booking-content">
          <div className="create-booking-header">
            <h1 className="create-booking-title">Tạo đơn đặt phòng</h1>
            <p className="create-booking-subtitle">Tạo đơn đặt phòng mới cho khách hàng</p>
          </div>

          <div className="create-booking-container">
            <CreateBookingForm
              onAddRoom={handleAddRoom}
              selectedRooms={selectedRooms}
              onRemoveRoom={handleRemoveRoom}
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
            />
            <BookingSummaryCard
              selectedRooms={selectedRooms}
              totalGuests={calculateTotalGuests()}
              totalRooms={calculateTotalRooms()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBookingPage;
