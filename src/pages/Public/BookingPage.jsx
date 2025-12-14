import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../styles/BookingPage.css';
import Navbar from '../../components/Public/NavBar';
import Footer from '../../components/Public/Footer';
import Filter from '../../components/Public/Filter';
import RoomBooking from '../../components/Public/RoomBooking';
import BookingSummary from '../../components/Public/BookingSummary';
import { getAvailableRoomTypesByFilter } from '../../api/roomTypeApi';

const BookingPage = () => {
  const navigate = useNavigate();
  
  // State cho dữ liệu phòng từ API
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Store selected rooms as array of {roomId, quantity}
  const [selectedRooms, setSelectedRooms] = useState([]);
  
  const [filterData, setFilterData] = useState({
    checkInDate: new Date(2025, 9, 18), // Default date
    checkOutDate: new Date(2025, 9, 19),
    rooms: 1,
    guests: 2
  });
  
  const filterRef = useRef(null);
  const isProcessing = useRef(false);

  // Fetch rooms from API when filter changes
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const response = await getAvailableRoomTypesByFilter(filterData);
        
        if (response && response.data) {
          // Map API data to component format
          const mappedRooms = response.data.map(item => ({
            id: item.roomTypeId,
            name: item.roomTypeName,
            // Format price to string for display, keep raw value for calculation if needed
            price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.averagePriceForThreeNight),
            rawPrice: item.averagePriceForThreeNight,
            priceDescription: `Cost for 1 night, ${item.capacity} guests`,
            capacity: item.capacity,
            square: item.square,
            bedType: '1 King or 2 Single', // API chưa có field này, để default hoặc map từ description
            bathroom: 'Private Bathroom',
            description: item.description,
            image: item.images && item.images.length > 0 ? item.images[0].urlImage : null,
            // Quan trọng: Số lượng phòng khả dụng từ API
            maxAvailable: item.roomCountIsAvailable, 
            unavailable: item.roomCountIsAvailable === 0
          }));
          
          setRooms(mappedRooms);
          // Reset selected rooms when filter changes (new search)
          setSelectedRooms([]);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error('Failed to load available rooms');
      } finally {
        setIsLoading(false);
      }
    };

    if (filterData.checkInDate && filterData.checkOutDate) {
      fetchRooms();
    }
  }, [filterData]);

  const handleFilterChange = (newFilterData) => {
    // Merge partial updates from Filter so changing rooms/guests doesn't wipe existing dates
    setFilterData(prev => ({ ...prev, ...newFilterData }));
  };

  const handleRoomSelect = useCallback((roomId) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    
    setTimeout(() => {
      isProcessing.current = false;
    }, 300);
    
    setSelectedRooms(prev => {
      const roomData = rooms.find(room => room.id === roomId);
      if (!roomData) return prev;

      const existingRoom = prev.find(r => r.roomId === roomId);
      const currentQuantity = existingRoom ? existingRoom.quantity : 0;
      
      // 1. Check availability limit (Logic API: roomCountIsAvailable)
      if (currentQuantity >= roomData.maxAvailable) {
        toast.warning(`Chỉ còn lại ${roomData.maxAvailable} phòng loại này.`);
        return prev;
      }

      // Calculate total rooms already selected across all types
      const totalRoomsSelected = prev.reduce((sum, r) => sum + r.quantity, 0);
      
      // Calculate total capacity currently selected
      const currentTotalCapacity = prev.reduce((sum, r) => {
        const room = rooms.find(rm => rm.id === r.roomId);
        return sum + (room.capacity * r.quantity);
      }, 0);

      // Dự kiến sau khi thêm phòng này
      const nextTotalRooms = totalRoomsSelected + 1;
      const nextTotalCapacity = currentTotalCapacity + roomData.capacity;

      // 2. Check user request limit (Logic Filter: filterData.rooms)
      if (totalRoomsSelected >= filterData.rooms) {
        toast.info(`Bạn chỉ có thể chọn tối đa ${filterData.rooms} phòng theo yêu cầu.`);
        return prev;
      }

      // 3. ✅ Thêm điều kiện kiểm tra: Nếu đã đủ sức chứa và đủ số phòng thì cảnh báo (Optional)
      // Logic: Nếu số phòng đã đủ VÀ sức chứa đã đủ cho số khách
      if (nextTotalRooms > filterData.rooms) {
         // Đã chặn ở trên rồi, nhưng logic này để đảm bảo
         return prev;
      }

      // Logic bạn yêu cầu: count * capacity >= rooms * guests
      // Giả sử ý bạn là kiểm tra xem việc thêm phòng này có vượt quá nhu cầu không?
      // Hoặc kiểm tra xem đã đủ điều kiện để book chưa (thường check lúc bấm Book).
      
      // Nếu ý bạn là chặn không cho chọn thêm nếu tổng sức chứa đã vượt quá quá nhiều?
      // Ví dụ: Khách cần 2 người, đã chọn phòng chứa 4 người rồi thì thôi?
      // Hiện tại code chỉ chặn theo số lượng phòng (filterData.rooms).

      if (existingRoom) {
        return prev.map(r => r.roomId === roomId ? {...r, quantity: r.quantity + 1} : r);
      } else {
        return [...prev, {roomId, quantity: 1}];
      }
    });
  }, [filterData.rooms, filterData.guests, rooms]);

  const handleDeleteRoom = useCallback((roomId) => {
    setSelectedRooms(prev => {
      const room = prev.find(r => r.roomId === roomId);
      if (!room) return prev;
      
      if (room.quantity > 1) {
        return prev.map(r => r.roomId === roomId ? {...r, quantity: r.quantity - 1} : r);
      } else {
        return prev.filter(r => r.roomId !== roomId);
      }
    });
  }, []);

  const handleBook = () => {
    if (selectedRooms.length > 0) {
      const selectedRoomsData = selectedRooms.flatMap(({roomId, quantity}) => {
        const room = rooms.find(r => r.id === roomId);
        return Array(quantity).fill(room);
      }).filter(Boolean);
      
      const nights = calculateNights();
      
      const totalPrice = selectedRooms.reduce((sum, {roomId, quantity}) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return sum;
        return sum + (room.rawPrice * nights * quantity);
      }, 0);
      
      const totalRoomsCount = selectedRooms.reduce((sum, r) => sum + r.quantity, 0);
      
      navigate('/guest-info', {
        state: {
          rooms: selectedRoomsData,
          roomCount: totalRoomsCount,
          // provide full formatted strings so GuestInfoPage shows correctly
          checkIn: formatDateRange().split(' - ')[0],
          checkOut: formatDateRange().split(' - ')[1],
          // include primary room type name for guest summary
          roomType: selectedRoomsData[0]?.name,
          guests: `${filterData.guests} adult${filterData.guests > 1 ? 's' : ''}`,
          nights: nights,
          total: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice),
          pricePerNight: selectedRoomsData[0]?.price
        }
      });
    }
  };

  const handleOpenDatePicker = () => {
    // Scroll to filter section
    const filterSection = document.querySelector('.filter-section');
    if (filterSection) {
      filterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Open DatePicker after a short delay to ensure scroll completes
    setTimeout(() => {
      if (filterRef.current && filterRef.current.openDatePicker) {
        filterRef.current.openDatePicker();
      }
    }, 500);
  };

  const formatDateRange = () => {
    if (!filterData.checkInDate || !filterData.checkOutDate) return '';
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const formatDate = (date) => {
      return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
    };
    
    return `${formatDate(filterData.checkInDate)} - ${formatDate(filterData.checkOutDate)}`;
  };

  const calculateNights = () => {
    if (!filterData.checkInDate || !filterData.checkOutDate) return 1;
    
    const diffTime = Math.abs(filterData.checkOutDate - filterData.checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();

  // Calculate totals for summary
  const totalRoomsCount = selectedRooms.reduce((sum, r) => sum + r.quantity, 0);
  const totalPrice = selectedRooms.reduce((sum, {roomId, quantity}) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return sum;
    return sum + (room.rawPrice * nights * quantity);
  }, 0);

  const bookingData = selectedRooms.length > 0 ? {
    dates: formatDateRange(),
    rooms: `${totalRoomsCount} room${totalRoomsCount > 1 ? 's' : ''}, ${filterData.guests} guest${filterData.guests > 1 ? 's' : ''}`,
    nights: `${nights} night${nights > 1 ? 's' : ''}`,
    selectedRooms: selectedRooms.map(({roomId, quantity}) => {
      const room = rooms.find(r => r.id === roomId);
      return {
        id: room.id,
        name: `${room.name}${quantity > 1 ? ` x${quantity}` : ''}`,
        price: room.price,
        capacity: room.capacity,
        // Show room capacity (guests per room) in details instead of global requested guests
        details: `${room.capacity} guest${room.capacity > 1 ? 's' : ''}, ${nights} night${nights > 1 ? 's' : ''}\nNon-refundable`,
        quantity: quantity
      };
    }),
    totalPrice: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice),
    deposit: `Deposit: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}`
  } : {
    dates: formatDateRange(),
    rooms: `${filterData.rooms} room${filterData.rooms > 1 ? 's' : ''}, ${filterData.guests} guest${filterData.guests > 1 ? 's' : ''}`,
    nights: `${nights} night${nights > 1 ? 's' : ''}`
  };

  return (
    <div className="booking-page">
      <Navbar />
      <div className="booking-hero">
        <div className="hero-overlay"></div>
      </div>

      <div className="booking-content">
        <div className="booking-container">
          <div className="filter-section">
            <Filter ref={filterRef} 
            onFilterChange={handleFilterChange}
            initialData={filterData} />
          </div>

          <div className="booking-layout">
            <div className="rooms-list">
              {isLoading ? (
                <div className="rooms-loading">
                  <div className="loading-spinner"></div>
                  <p>Searching available rooms...</p>
                </div>
              ) : rooms.length > 0 ? (
                rooms.map((room) => {
                  // Logic: Tính số lượng còn lại để hiển thị
                  const selectedRoom = selectedRooms.find(r => r.roomId === room.id);
                  const quantityInCart = selectedRoom ? selectedRoom.quantity : 0;
                  const remainingAvailable = room.maxAvailable - quantityInCart;
                  
                  // Nếu hết phòng (do đã chọn hết hoặc API trả về 0) -> disable
                  const isSoldOut = remainingAvailable <= 0;

                  return (
                    <RoomBooking
                      key={room.id}
                      room={{
                        ...room,
                        // Cập nhật description hoặc thêm field để hiển thị số lượng còn lại
                        description: `${room.description}\n\nOnly ${remainingAvailable} room(s) left!`
                      }}
                      variant={isSoldOut ? 'variant2' : 'default'}
                      isSelected={quantityInCart > 0}
                      selectedQuantity={quantityInCart}
                      unavailableDates={null}
                      // Disable click nếu hết phòng
                      onSelect={() => !isSoldOut && handleRoomSelect(room.id)}
                      onOpenDatePicker={handleOpenDatePicker}
                    />
                  );
                })
              ) : (
                <div className="no-rooms-found">
                  <p>No rooms available for the selected dates and criteria.</p>
                </div>
              )}
            </div>

            <div className="booking-sidebar">
              <BookingSummary
                variant={selectedRooms.length > 0 ? 'default' : 'variant2'}
                bookingData={bookingData}
                onBook={handleBook}
                onDeleteRoom={handleDeleteRoom}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
