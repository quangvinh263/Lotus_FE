import { useState } from 'react';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import PeopleIcon from '../../assets/icons/PeopleIcon.svg';
import RoomTypeDropdown from './RoomTypeDropdown';
import DateTimePicker from './DateTimePicker';
import GuestInfoForm from './GuestInfoForm';
import './CreateBookingForm.css';

function CreateBookingForm({ onAddRoom, selectedRooms, onRemoveRoom, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate }) {
  // Khởi tạo với 1 khách đại diện
  const [guests, setGuests] = useState([
    {
      fullName: '',
      idNumber: '',
      phoneNumber: '',
      email: '',
      dateOfBirth: '',
      nationality: 'Việt Nam',
      address: '',
      isPrimary: true
    }
  ]);

  const [roomData, setRoomData] = useState({
    roomType: '',
    numberOfRooms: 1,
    guestsPerRoom: 1,
  });

  const calculateTotalGuests = () => {
    return selectedRooms.reduce((total, room) => total + (room.guestsPerRoom * room.numberOfRooms), 0);
  };

  // Sample room types with prices
  const roomTypes = [
    { id: 1, name: 'Superior Room', price: 1200000, description: 'Không gian ấm cúng, thiết kế đơn giản và tinh tế' },
    { id: 2, name: 'Deluxe Room', price: 1800000, description: 'Diện tích rộng rãi, nội thất cao cấp, phong cách hiện đại' },
    { id: 3, name: 'Executive Room', price: 2400000, description: 'Tiện nghi cao cấp, dịch vụ ưu tiên cho khách doanh nhân' },
    { id: 4, name: 'Grand Suite', price: 3500000, description: 'Suite rộng rãi với khu vực tiếp khách riêng biệt, view tuyệt đẹp' },
    { id: 5, name: 'Lotus Suite', price: 5000000, description: 'Đỉnh cao sang trọng với ban công rộng và khu vực thư giãn riêng' },
  ];

  const handleRoomDataChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleAddRoomClick = () => {
    if (!roomData.roomType) {
      alert('Vui lòng chọn loại phòng');
      return;
    }

    const selectedRoomType = roomTypes.find(rt => rt.name === roomData.roomType);
    
    const newRoom = {
      roomType: roomData.roomType,
      numberOfRooms: parseInt(roomData.numberOfRooms),
      guestsPerRoom: parseInt(roomData.guestsPerRoom),
      pricePerNight: selectedRoomType.price,
    };

    onAddRoom(newRoom);

    // Reset room data
    setRoomData({
      roomType: '',
      numberOfRooms: 1,
      guestsPerRoom: 1,
    });
  };

  const calculateTotalRooms = () => {
    return selectedRooms.reduce((total, room) => total + room.numberOfRooms, 0);
  };

  const handleSubmit = () => {
    const primaryGuest = guests[0];
    
    if (!primaryGuest.fullName || !primaryGuest.phoneNumber) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ và tên, Số điện thoại)');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      alert('Vui lòng chọn ngày check-in và check-out');
      return;
    }

    if (selectedRooms.length === 0) {
      alert('Vui lòng thêm ít nhất một phòng');
      return;
    }

    const bookingData = {
      primaryGuest: primaryGuest,
      guests: guests, // Danh sách người đại diện (có thể thêm nhiều người sau khi check-in)
      checkIn: checkInDate,
      checkOut: checkOutDate,
      rooms: selectedRooms,
      totalGuests: calculateTotalGuests(),
      totalRooms: calculateTotalRooms(),
    };

    console.log('Booking Data:', bookingData);
    alert('Tạo đơn đặt phòng thành công!');
    // TODO: Send to backend API
  };

  return (
    <div className="cbf-card">
      <h2 className="cbf-section-title">Thông tin đặt phòng</h2>

      <div className="cbf-content">
        {/* Thông tin khách hàng - Người đại diện */}
        <div className="cbf-section">
          <GuestInfoForm
            guests={guests}
            onGuestsChange={setGuests}
            totalGuests={calculateTotalGuests() || 1}
            showIdNumber={false}
          />
        </div>

        {/* Chi tiết đặt phòng */}
        <div className="cbf-section">
          <h3 className="cbf-section-heading">Chi tiết đặt phòng</h3>
          <div className="cbf-fields cbf-date-fields">
            <div className="cbf-field">
              <label className="cbf-label">Ngày check-in *</label>
              <DateTimePicker 
                value={checkInDate}
                onChange={setCheckInDate}
                placeholder="Chọn ngày"
              />
            </div>

            <div className="cbf-field">
              <label className="cbf-label">Ngày check-out *</label>
              <DateTimePicker 
                value={checkOutDate}
                onChange={setCheckOutDate}
                placeholder="Chọn ngày"
              />
            </div>
          </div>
        </div>

        {/* Chọn phòng */}
        <div className="cbf-section">
          <h3 className="cbf-section-heading-large">Chọn phòng</h3>
          <div className="cbf-fields cbf-room-fields">
            <div className="cbf-field">
              <label className="cbf-label">Loại phòng</label>
              <RoomTypeDropdown
                value={roomData.roomType}
                onChange={handleRoomDataChange}
                roomTypes={roomTypes}
              />
            </div>

            <div className="cbf-field cbf-field-small">
              <label className="cbf-label">Số phòng</label>
              <input
                type="number"
                name="numberOfRooms"
                className="cbf-input-number"
                min="1"
                value={roomData.numberOfRooms}
                onChange={handleRoomDataChange}
              />
            </div>

            <div className="cbf-field cbf-field-medium">
              <label className="cbf-label">Số khách/phòng</label>
              <input
                type="number"
                name="guestsPerRoom"
                className="cbf-input-number"
                min="1"
                value={roomData.guestsPerRoom}
                onChange={handleRoomDataChange}
              />
            </div>
          </div>

          <button className="cbf-add-room-button" onClick={handleAddRoomClick}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3.33333V12.6667" stroke="#133E87" strokeWidth="1.33333" strokeLinecap="round"/>
              <path d="M3.33333 8H12.6667" stroke="#133E87" strokeWidth="1.33333" strokeLinecap="round"/>
            </svg>
            <span>Thêm phòng</span>
          </button>
        </div>

        {/* Danh sách phòng đã chọn */}
        {selectedRooms.length > 0 && (
          <div className="cbf-selected-rooms-section">
            <h4 className="cbf-selected-rooms-heading">Danh sách phòng đã chọn:</h4>
            {selectedRooms.map((room, index) => (
              <div key={index} className="cbf-selected-room-card">
                <div className="cbf-selected-room-content">
                  <div className="cbf-selected-room-info">
                    <div className="cbf-room-badge">{room.roomType}</div>
                    <span className="cbf-room-count">x {room.numberOfRooms} phòng</span>
                  </div>
                  <div className="cbf-room-details">
                    <img src={PeopleIcon} alt="People" className="cbf-room-detail-icon" />
                    <span className="cbf-room-detail-text">{room.guestsPerRoom} khách/phòng</span>
                    <span className="cbf-room-detail-dot">•</span>
                    <span className="cbf-room-detail-text">Tổng: {room.guestsPerRoom * room.numberOfRooms} người</span>
                  </div>
                </div>
                <div className="cbf-selected-room-actions">
                  <span className="cbf-room-price">---</span>
                  <button className="cbf-remove-room-button" onClick={() => onRemoveRoom(index)}>
                    <img src={DeleteIcon} alt="Delete" />
                  </button>
                </div>
              </div>
            ))}

            <div className="cbf-selected-rooms-summary">
              <div className="cbf-summary-row">
                <span className="cbf-summary-label">Tổng:</span>
                <span className="cbf-summary-value">{calculateTotalGuests()} khách - {calculateTotalRooms()} phòng</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button className="cbf-submit-button" onClick={handleSubmit}>
          Tạo đơn đặt phòng
        </button>
      </div>
    </div>
  );
}

export default CreateBookingForm;
