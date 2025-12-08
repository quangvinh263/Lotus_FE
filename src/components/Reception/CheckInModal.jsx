import React, { useState, useEffect, useMemo } from 'react';
import './CheckInModal.css';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import CheckInIcon from '../../assets/icons/CheckInIcon.svg';
import GuestInfoForm from './GuestInfoForm';
import RoomGuestAssignment from './RoomGuestAssignment';
import { getBookingDetail, checkInBooking } from '../../api/bookingApi';
import { searchRooms } from '../../api/roomApi';
import { toast } from 'react-toastify';

const CheckInModal = ({ booking, onClose, onConfirm }) => {
  // --- STATE ---
  const [guests, setGuests] = useState([{
    fullName: booking.guestName || '',
    idNumber: '',
    gender: 'male',
    isPrimary: true
  }]);

  const [selectedRooms, setSelectedRooms] = useState({});
  const [roomAssignments, setRoomAssignments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  
  // ✅ Thay đổi cấu trúc: Lưu object { "Type": [list_of_details] }
  const [reservationDetails, setReservationDetails] = useState({}); 

  // --- HELPERS ---
  const getMaxGuestsPerRoom = () => {
    const maxGuests = {};
    if (booking.roomsByType) {
      Object.keys(booking.roomsByType).forEach(type => {
        // Logic mapping sức chứa tùy chỉnh theo tên loại phòng
        if (type.includes('Family') || type.includes('Suite')) maxGuests[type] = 4;
        else if (type.includes('Deluxe') || type.includes('Executive')) maxGuests[type] = 3;
        else maxGuests[type] = 2;
      });
    }
    return maxGuests;
  };

  const getTotalRoomCapacity = () => {
    const maxGuestsPerRoom = getMaxGuestsPerRoom();
    let totalCapacity = 0;
    if (booking.roomsByType) {
      Object.entries(booking.roomsByType).forEach(([roomType, count]) => {
        const capacityPerRoom = maxGuestsPerRoom[roomType] || 2;
        totalCapacity += capacityPerRoom * count;
      });
    }
    return totalCapacity;
  };

  const getTypeColor = (type) => {
    // Màu sắc badge loại phòng
    const colors = {
      'Superior': '#608BC1', 'Deluxe': '#608BC1',
      'Executive': '#608BC1', 'Suite': '#608BC1',
      'Standard': '#608BC1', 'Family': '#608BC1'
    };
    // Tìm màu khớp một phần tên hoặc trả về mặc định
    const foundKey = Object.keys(colors).find(k => type.includes(k));
    return foundKey ? colors[foundKey] : '#608BC1';
  };

  const getTotalSelectedRooms = () => {
    return Object.values(selectedRooms).reduce((total, rooms) => total + rooms.length, 0);
  };

  const getTotalAssignedGuests = () => {
    // Đếm số khách unique đã được gán vào phòng
    const assignedIndices = Object.values(roomAssignments).flat();
    return new Set(assignedIndices).size;
  };

  // --- EFFECT: LOAD DATA ---
  useEffect(() => {
    const fetchData = async () => {
      if (booking && booking.bookingCode) {
        try {
          // 1. Lấy chi tiết đơn đặt phòng
          const result = await getBookingDetail(booking.bookingCode);
          
          if (result.success) {
            const data = result.data;

            // Set khách chính mặc định
            const mainGuest = {
              fullName: data.fullName || booking.guestName || '',
              idNumber: '',
              gender: 'male',
              isPrimary: true
            };
            setGuests([mainGuest]);

            // Xử lý mapping loại phòng và Detail IDs
            const roomsByTypeCount = {};
            const detailsByTypeMap = {}; // ✅ Cấu trúc mới: Map<Type, Array<Detail>>

            if (data.typeDetails && data.typeDetails.length > 0) {
              data.typeDetails.forEach(typeDetail => {
                const roomType = typeDetail.typeName || 'Standard';
                
                // Đếm số lượng
                roomsByTypeCount[roomType] = (roomsByTypeCount[roomType] || 0) + 1;

                // Gom nhóm Detail ID vào mảng
                if (!detailsByTypeMap[roomType]) {
                  detailsByTypeMap[roomType] = [];
                }
                
                // Push thông tin detail vào hàng đợi
                detailsByTypeMap[roomType].push({
                  detailId: typeDetail.detailId, 
                  capacity: typeDetail.capacity,
                  pricePerNight: typeDetail.priceRoomPerNight
                });
              });
            }

            // Cập nhật booking object cục bộ để UI render đúng số lượng cần thiết
            booking.roomsByType = roomsByTypeCount;
            booking.totalRooms = data.roomCount || 0;
            booking.guestCount = data.countPeople || 1;
            
            // Lưu vào state
            setReservationDetails(detailsByTypeMap);

            // 2. Tìm kiếm phòng trống cho từng loại phòng
            const allAvailableRooms = [];
            
            for (const [roomTypeName, count] of Object.entries(roomsByTypeCount)) {
              console.log(`🔎 Tìm phòng trống cho: ${roomTypeName}...`);
              
              const roomsResult = await searchRooms({
                typeName: roomTypeName,
                checkInDate: data.checkInDate,
                checkOutDate: data.checkOutDate,
                status: 'Available'
              });

              // ✅ FIX QUAN TRỌNG: Kiểm tra và Push vào mảng tổng
              const foundRooms = roomsResult.rooms || roomsResult.data;
              if (roomsResult.success && foundRooms && foundRooms.length > 0) {
                console.log(`   -> Tìm thấy ${foundRooms.length} phòng ${roomTypeName}`);
                allAvailableRooms.push(...foundRooms);
              } else {
                console.warn(`   -> Không tìm thấy phòng trống nào cho ${roomTypeName}`);
              }
            }

            setAvailableRooms(allAvailableRooms);

          } else {
            console.error('❌ Failed fetch booking:', result.message);
          }
        } catch (err) {
          console.error('❌ Error in fetchData:', err);
        }
      }
    };
    
    fetchData();
  }, [booking]);

  // --- MEMO: GROUP ROOMS BY TYPE FOR UI ---
  const roomsByType = useMemo(() => {
    return availableRooms.reduce((acc, room) => {
      const roomType = room.roomTypeName || room.type;
      
      // Chỉ hiện những loại phòng có trong đơn đặt
      if (booking.roomsByType && booking.roomsByType[roomType]) {
        if (!acc[roomType]) acc[roomType] = [];
        
        acc[roomType].push({
          id: room.roomId,
          number: room.roomNumber,
          type: roomType,
          price: room.pricePerNight || 0,
          status: room.status
        });
      }
      return acc;
    }, {});
  }, [availableRooms, booking.roomsByType]);

  // --- HANDLERS ---
  const handleRoomSelect = (roomType, room) => {
    setSelectedRooms(prev => {
      const typeRooms = prev[roomType] || [];
      const isSelected = typeRooms.find(r => r.id === room.id);
      
      // Limit số lượng chọn không vượt quá số lượng đặt
      const neededCount = booking.roomsByType[roomType] || 0;

      if (isSelected) {
        // Bỏ chọn
        return { ...prev, [roomType]: typeRooms.filter(r => r.id !== room.id) };
      } else {
        // Chọn mới (nếu chưa đủ số lượng)
        if (typeRooms.length < neededCount) {
          return { ...prev, [roomType]: [...typeRooms, room] };
        } else {
          alert(`Đã chọn đủ số lượng phòng cho loại ${roomType}`);
          return prev;
        }
      }
    });
  };

  // ✅ HÀM CONFIRM QUAN TRỌNG NHẤT
  const handleConfirm = async () => {
    try {
      // 1. Tạo bản sao hàng đợi
      const detailsQueue = JSON.parse(JSON.stringify(reservationDetails));
      const checkInPromises = [];

      // 2. Duyệt qua từng loại phòng
      for (const [roomType, rooms] of Object.entries(selectedRooms)) {
        const validRooms = rooms.filter(r => r);
        
        for (const room of validRooms) {
          // A. Lấy detail ID
          const availableIds = detailsQueue[roomType];
          if (!availableIds || availableIds.length === 0) {
            alert(`Lỗi: Hết DetailID cho phòng ${room.number} (${roomType})`);
            return;
          }
          const detailToUse = availableIds.shift();

          // B. ✅ Lấy guest indices và VALIDATE
          const guestIndices = roomAssignments[room.id] || [];
          console.log(`\n📌 Room ${room.number} - Guest indices:`, guestIndices);
          
          if (guestIndices.length === 0) {
            alert(`Phòng ${room.number} chưa được gán khách!`);
            return;
          }

          // C. ✅ Map indices sang guest data với validation đầy đủ
          const guestPayload = [];
          for (const idx of guestIndices) {
            console.log(`   → Checking guest at index ${idx}:`, guests[idx]);
            
            const g = guests[idx];
            
            // Validate guest tồn tại
            if (!g) {
              alert(`Lỗi: Không tìm thấy thông tin khách thứ ${idx + 1}`);
              console.error(`❌ Guest at index ${idx} is undefined. Total guests:`, guests);
              return;
            }

            // Validate CCCD
            if (!g.idNumber || g.idNumber.trim() === '') {
              alert(`Khách "${g.fullName}" chưa nhập CCCD!`);
              return;
            }

            // Validate fullName
            if (!g.fullName || g.fullName.trim() === '') {
              alert(`Vui lòng nhập tên đầy đủ cho khách thứ ${idx + 1}`);
              return;
            }

            // Push vào payload
            guestPayload.push({
              FullName: g.fullName.trim(),
              CCCD: g.idNumber.trim(),
              Gender: g.gender === 'male' ? 'Male' : 'Female'
            });
          }

          console.log(`   ✅ Final guest payload for room ${room.number}:`, guestPayload);

          // D. Tạo request
          const checkInData = {
            ReservationDetailId: detailToUse.detailId,
            AssignedRoomID: room.id,
            Guests: guestPayload
          };

          console.log(`\n📤 Check-in request for room ${room.number}:`, checkInData);

          // E. Đẩy vào promise array
          checkInPromises.push(
            checkInBooking(checkInData)
              .then(res => {
                console.log(`✅ Success room ${room.number}:`, res);
                return { success: true, room: room.number, data: res };
              })
              .catch(err => {
                console.error(`❌ Failed room ${room.number}:`, err.response?.data);
                return { 
                  success: false, 
                  room: room.number, 
                  message: err.response?.data?.message || err.message 
                };
              })
          );
        }
      }

      if (checkInPromises.length === 0) {
        toast.error('Vui lòng chọn phòng trước khi xác nhận.');
        return;
      }

      console.log(`\n🚀 Sending ${checkInPromises.length} check-in requests...`);

      // 3. Execute all requests
      const results = await Promise.all(checkInPromises);
      
      console.log('\n📥 Check-in results:', results);

      const failures = results.filter(r => !r.success);
      
      if (failures.length > 0) {
        const msg = failures.map(f => `- Phòng ${f.room}: ${f.message}`).join('\n');
        
        const successCount = results.length - failures.length;
        if (successCount > 0) {
          onConfirm({ success: true, partial: true });
        }
      } else {
        onConfirm({ 
          success: true, 
          guests, 
          roomAssignments 
        });
        window.location.reload();
      }

    } catch (error) {
      alert('Lỗi hệ thống khi xử lý check-in.');
    }
  };

  // --- RENDER ---
  return (
    <div className="checkin-modal-overlay" onClick={onClose}>
      <div className="checkin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkin-close-button" onClick={onClose}><span>&times;</span></button>

        <div className="checkin-modal-header">
          <h2>Xác nhận Check-in</h2>
          <p>
            Vui lòng xác nhận thông tin khách và chọn phòng<br/>
            <small style={{ color: '#6B7280', fontSize: '12px' }}>
              Đã đặt: {booking.guestCount || 0} khách • Sức chứa tối đa: {getTotalRoomCapacity()} khách
            </small>
          </p>
        </div>

        <div className="checkin-modal-content">
          {/* 1. Form nhập khách */}
          <div className="guest-form">
            <GuestInfoForm
              guests={guests}
              onGuestsChange={setGuests}
              totalGuests={getTotalRoomCapacity()}
              showIdNumber={true}
            />
          </div>

          {/* 2. Khu vực chọn phòng */}
          <div className="room-assignment">
            <div className="assignment-header">
              <label>Gán phòng cho đơn đặt *</label>
              <div className="rooms-badge">
                {getTotalSelectedRooms()}/{booking.totalRooms} phòng đã gán
              </div>
            </div>

            {/* Render từng loại phòng */}
            {Object.entries(roomsByType).map(([roomType, typeRooms]) => (
              <div key={roomType} className="room-type-section">
                <div className="room-type-header">
                  <div className="room-type-info">
                    <span className="checkin-room-type-badge" style={{ background: getTypeColor(roomType) }}>
                      {roomType}
                    </span>
                    <span className="room-need">Cần {booking.roomsByType[roomType] || 0} phòng</span>
                  </div>
                  <span className="rooms-selected">
                    Đã chọn: {(selectedRooms[roomType] || []).length}/{booking.roomsByType[roomType] || 0}
                  </span>
                </div>

                <div className="room-selection-area">
                  <div className="search-header">
                    <p>Chọn phòng trống ({typeRooms.length} phòng):</p>
                  </div>

                  <div className="search-wrapper">
                    <input
                      type="text"
                      placeholder="Tìm số phòng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={SearchIcon} alt="Search" className="search-icon" />
                  </div>

                  <div className="checkin-modal-rooms-grid">
                    {typeRooms
                      .filter(room => room.number.includes(searchTerm))
                      .map(room => {
                        const isSelected = (selectedRooms[roomType] || []).find(r => r.id === room.id);
                        return (
                          <button
                            key={room.id}
                            className={`checkin-room-select-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleRoomSelect(roomType, room)}
                          >
                            <span className="checkin-room-number-text">{room.number}</span>
                          </button>
                        );
                      })}
                  </div>

                  {/* Hiển thị phòng đã chọn */}
                  {(selectedRooms[roomType] || []).length > 0 && (
                    <div className="selected-rooms-display">
                      <p>Phòng đã chọn:</p>
                      <div className="selected-rooms-badges">
                        {(selectedRooms[roomType] || []).map(room => (
                          <span key={room.id} className="selected-room-badge">
                            {room.number}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 3. Gán khách vào phòng */}
          {getTotalSelectedRooms() > 0 && guests.length > 0 && (
            <div className="room-guest-assignment-section">
              <RoomGuestAssignment
                selectedRooms={selectedRooms}
                guests={guests}
                onAssignmentChange={setRoomAssignments}
                maxGuestsPerRoom={getMaxGuestsPerRoom()}
              />
            </div>
          )}
        </div>

        <div className="checkin-modal-footer">
          <button className="checkin-btn-cancel" onClick={onClose}>Hủy</button>
          <button
            className="checkin-btn-confirm"
            disabled={
              getTotalSelectedRooms() !== booking.totalRooms ||
              guests.length === 0 ||
              guests.some(g => !g.fullName || !g.idNumber || !g.gender) ||
              getTotalAssignedGuests() !== guests.length
            }
            onClick={handleConfirm}
          >
            <img src={CheckInIcon} alt="Check-in" />
            Xác nhận Check-in ({getTotalSelectedRooms()}/{booking.totalRooms})
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;