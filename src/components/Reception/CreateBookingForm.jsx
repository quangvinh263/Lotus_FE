import { useState, useEffect } from 'react';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import PeopleIcon from '../../assets/icons/PeopleIcon.svg';
import RoomTypeDropdown from './RoomTypeDropdown';
import DateTimePicker from './DateTimePicker';
import GuestInfoForm from './GuestInfoForm';
import { createBooking } from '../../api/bookingApi';
import { createCustomer, findCustomerByPhone, deleteCustomer } from '../../api/customerApi';
import { getAllRoomTypes } from '../../api/roomTypeApi';
import './CreateBookingForm.css';

function CreateBookingForm({ onAddRoom, selectedRooms, onRemoveRoom, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate }) {
  // Thông tin khách hàng đại diện
  const [guestInfo, setGuestInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    gender: 'male',
    dateOfBirth: ''
  });

  const [roomData, setRoomData] = useState({
    roomType: '',
    numberOfRooms: 1,
    guestsPerRoom: 1,
  });

  const [roomTypes, setRoomTypes] = useState([]);
  const [isLoadingRoomTypes, setIsLoadingRoomTypes] = useState(true);

  // Fetch room types từ API khi component mount
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setIsLoadingRoomTypes(true);
        const result = await getAllRoomTypes();
        
        if (result.success && result.roomTypes) {
          // Map sang format phù hợp cho dropdown
          const mappedRoomTypes = result.roomTypes.map(rt => ({
            id: rt.id, // roomTypeId từ backend
            name: rt.name + ' Room', // "Deluxe" -> "Deluxe Room"
            price: rt.price,
            description: rt.description || '',
            capacity: rt.capacity
          }));
          
          setRoomTypes(mappedRoomTypes);
          console.log('✅ Loaded room types:', mappedRoomTypes);
        } else {
          console.error('❌ Failed to load room types:', result.message);
          alert('Không thể tải danh sách loại phòng. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('❌ Error fetching room types:', error);
        alert('Có lỗi xảy ra khi tải danh sách loại phòng.');
      } finally {
        setIsLoadingRoomTypes(false);
      }
    };

    fetchRoomTypes();
  }, []);

  const calculateTotalGuests = () => {
    return selectedRooms.reduce((total, room) => total + (room.guestsPerRoom * room.numberOfRooms), 0);
  };

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
    const numRooms = parseInt(roomData.numberOfRooms) || 1;
    const guestsPerRoom = parseInt(roomData.guestsPerRoom) || 1;
    
    // Validate số khách/phòng không vượt quá capacity
    if (guestsPerRoom > selectedRoomType.capacity) {
      const maxTotal = selectedRoomType.capacity * numRooms;
      alert(`Số khách/phòng không được vượt quá ${selectedRoomType.capacity} người.\n` +
            `Với ${numRooms} phòng, tối đa ${maxTotal} khách tổng (${selectedRoomType.capacity} khách/phòng).`);
      return;
    }
    
    const newRoom = {
      roomType: roomData.roomType,
      roomTypeId: selectedRoomType.id, // Lưu typeID cho backend
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

  const handleSubmit = async () => {
    if (!guestInfo.fullName || !guestInfo.phoneNumber) {
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

    // Validate check-out after check-in
    if (checkOutDate <= checkInDate) {
      alert('Ngày check-out phải sau ngày check-in');
      return;
    }

    try {
      // Bước 1: Tìm hoặc tạo customer
      console.log('Bước 1: Tìm khách hàng theo SĐT:', guestInfo.phoneNumber);
      let customerResult = await findCustomerByPhone(guestInfo.phoneNumber);
      
      let customerId;
      let isNewCustomer = false; // Track if we created a new customer
      
      if (customerResult.success) {
        console.log('Tìm thấy khách hàng cũ, customerID:', customerResult.customerId);
        customerId = customerResult.customerId;
      } else {
        // Không tìm thấy -> tạo mới
        console.log('Không tìm thấy → Tạo khách hàng mới');
        const createResult = await createCustomer(guestInfo);
        
        if (!createResult.success) {
          alert(`Lỗi tạo khách hàng: ${createResult.message}`);
          return;
        }
        
        console.log('Tạo khách hàng thành công, customerID:', createResult.customerId);
        customerId = createResult.customerId;
        isNewCustomer = true; // Mark that we created this customer
      }

      // Bước 2: Tạo reservation với customerID
      console.log('Bước 2: Tạo reservation với customerID:', customerId);
      const bookingData = {
        customerId: customerId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        rooms: selectedRooms,
        totalGuests: calculateTotalGuests(),
        totalRooms: calculateTotalRooms(),
      };

      console.log('Booking Data:', bookingData);

      const result = await createBooking(bookingData);
      
      if (result.success) {
        alert(result.message);
        // Reset form after successful creation
        setGuestInfo({
          fullName: '',
          phoneNumber: '',
          address: '',
          gender: 'male',
          dateOfBirth: ''
        });
        setCheckInDate(null);
        setCheckOutDate(null);
        // Clear selected rooms (handled by parent component)
        selectedRooms.forEach((_, index) => onRemoveRoom(0));
      } else {
        // ⚠️ ROLLBACK: If we created a new customer but booking failed, delete the customer
        if (isNewCustomer && customerId) {
          console.warn('⚠️ Booking failed, rolling back new customer:', customerId);
          const rollbackResult = await deleteCustomer(customerId);
          if (rollbackResult.success) {
            console.log('✅ Rollback successful: Customer deleted');
          } else {
            console.error('❌ Rollback failed:', rollbackResult.message);
          }
        }
        
        alert(`Lỗi tạo đơn: ${result.message}`);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Có lỗi xảy ra khi tạo đơn đặt phòng');
    }
  };

  return (
    <div className="cbf-card">
      <h2 className="cbf-section-title">Thông tin đặt phòng</h2>

      <div className="cbf-content">
        {/* Thông tin khách hàng - Người đại diện */}
        <div className="cbf-section">
          <h3 className="cbf-section-heading">Thông tin khách hàng</h3>
          <div className="cbf-fields">
            <div className="cbf-field">
              <label className="cbf-label">Họ và tên <span className="cbf-required">*</span></label>
              <input
                type="text"
                className="cbf-input"
                value={guestInfo.fullName}
                onChange={(e) => setGuestInfo({...guestInfo, fullName: e.target.value})}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="cbf-field">
              <label className="cbf-label">Số điện thoại <span className="cbf-required">*</span></label>
              <input
                type="tel"
                className="cbf-input"
                value={guestInfo.phoneNumber}
                onChange={(e) => setGuestInfo({...guestInfo, phoneNumber: e.target.value})}
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Email removed - only primary contact (name & phone) required */}

            <div className="cbf-field">
              <label className="cbf-label">Địa chỉ</label>
              <input
                type="text"
                className="cbf-input"
                value={guestInfo.address}
                onChange={(e) => setGuestInfo({...guestInfo, address: e.target.value})}
                placeholder="Nhập địa chỉ"
              />
            </div>

            <div className="cbf-field">
              <label className="cbf-label">Giới tính</label>
              <select
                className="cbf-input"
                value={guestInfo.gender}
                onChange={(e) => setGuestInfo({...guestInfo, gender: e.target.value})}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className="cbf-field">
              <label className="cbf-label">Ngày sinh</label>
              <DateTimePicker
                value={guestInfo.dateOfBirth}
                onChange={(val) => setGuestInfo({...guestInfo, dateOfBirth: val})}
                placeholder="Chọn ngày sinh"
              />
            </div>
          </div>
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
          <div className="cbf-fields cbf-room-fields" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
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
                max={roomData.roomType ? 
                  Math.floor((roomTypes.find(rt => rt.name === roomData.roomType)?.capacity * parseInt(roomData.numberOfRooms || 1)) / parseInt(roomData.numberOfRooms || 1)) 
                  : undefined}
                value={roomData.guestsPerRoom}
                onChange={handleRoomDataChange}
              />
              {roomData.roomType && (
                <span style={{ fontFamily: 'Arial', fontSize: '12px', color: '#608BC1', marginTop: '4px' }}>
                  Tối đa: {roomTypes.find(rt => rt.name === roomData.roomType)?.capacity} khách/phòng 
                  ({roomTypes.find(rt => rt.name === roomData.roomType)?.capacity * parseInt(roomData.numberOfRooms || 1)} khách tổng)
                </span>
              )}
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
