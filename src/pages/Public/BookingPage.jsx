import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/BookingPage.css';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import Filter from '../../components/Filter';
import RoomBooking from '../../components/RoomBooking';
import BookingSummary from '../../components/BookingSummary';

const BookingPage = () => {
  const navigate = useNavigate();
  // Store selected rooms as array of {roomId, quantity}
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [filterData, setFilterData] = useState({
    checkInDate: new Date(2025, 9, 18), // Oct 18, 2025
    checkOutDate: new Date(2025, 9, 19), // Oct 19, 2025
    rooms: 1,
    guests: 2
  });
  const filterRef = useRef(null);
  const isProcessing = useRef(false);

  // Sample room data - in real app this would come from API
  const allRooms = [
    {
      id: 1,
      name: 'Superior Room',
      price: 'VND 5,000,000',
      priceDescription: 'Cost for 1 night, 2 guests',
      capacity: 2, // Maximum guests
      bedType: '2 Single beds',
      bathroom: '1 Bathroom',
      description: `32m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

        A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.`
    },
    {
      id: 2,
      name: 'Deluxe Room',
      price: 'VND 7,000,000',
      priceDescription: 'Cost for 1 night, 3 guests',
      capacity: 3, // Maximum guests
      bedType: '1 King bed + 1 Single bed',
      bathroom: '1 Bathroom',
      description: `45m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

        An elevated experience with extra space and refined furnishings, blending modern style with sophisticated comfort.`
    },
    {
      id: 3,
      name: 'Executive Room',
      price: 'VND 10,000,000',
      priceDescription: 'Cost for 1 night, 4 guests',
      capacity: 4, // Maximum guests
      bedType: '2 King beds',
      bathroom: '2 Bathrooms',
      description: `60m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

        Designed for the discerning traveler, offering premium amenities and exclusive access for a truly seamless stay.`
    },
    {
      id: 4,
      name: 'Grand Suite',
      price: 'VND 15,000,000',
      priceDescription: 'Cost for 1 night, 6 guests',
      capacity: 6, // Maximum guests
      bedType: '3 King beds',
      bathroom: '3 Bathrooms',
      description: `90m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

        A spacious and opulent suite featuring a separate living area, offering an indulgent experience with breathtaking views.`
    },
    {
      id: 5,
      name: 'Lotus Suite',
      price: 'VND 20,000,000',
      priceDescription: 'Cost for 1 night, 8 guests',
      capacity: 8, // Maximum guests
      bedType: '4 King beds',
      bathroom: '4 Bathrooms',
      description: `120m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

        The pinnacle of luxury at our hotel. An elegant suite with a spacious balcony, where we arrange outdoor seating for your private moments of relaxation.`
    }
  ];

  // Don't filter rooms - show all available rooms
  const rooms = allRooms;

  const handleFilterChange = (newFilterData) => {
    setFilterData(newFilterData);
  };

  const handleRoomSelect = useCallback((roomId) => {
    // Prevent double clicks
    if (isProcessing.current) return;
    isProcessing.current = true;
    
    setTimeout(() => {
      isProcessing.current = false;
    }, 300);
    
    setSelectedRooms(prev => {
      // Find if this room type is already selected
      const existingRoom = prev.find(r => r.roomId === roomId);
      
      // Calculate total rooms already selected
      const totalRoomsSelected = prev.reduce((sum, r) => sum + r.quantity, 0);
      
      if (existingRoom) {
        // If clicking on already selected room, increase quantity
        if (totalRoomsSelected >= filterData.rooms) {
          alert(`Bạn chỉ có thể chọn tối đa ${filterData.rooms} phòng theo yêu cầu đặt phòng của bạn.`);
          return prev;
        }
        
        // Calculate total capacity after adding one more of this room
        const roomData = rooms.find(room => room.id === roomId);
        const totalCapacity = prev.reduce((sum, r) => {
          const room = rooms.find(rm => rm.id === r.roomId);
          return sum + (room.capacity * r.quantity);
        }, 0) + roomData.capacity;
        
        // Check if total capacity is sufficient when we reach max rooms
        if (totalRoomsSelected + 1 === filterData.rooms && totalCapacity < filterData.guests) {
          alert(`Tổng sức chứa của ${filterData.rooms} phòng phải đủ cho ${filterData.guests} khách. Hiện tại tổng chỉ có ${totalCapacity} người.`);
          return prev;
        }
        
        // Increase quantity
        return prev.map(r => r.roomId === roomId ? {...r, quantity: r.quantity + 1} : r);
      } else {
        // First time selecting this room type
        if (totalRoomsSelected >= filterData.rooms) {
          alert(`Bạn chỉ có thể chọn tối đa ${filterData.rooms} phòng theo yêu cầu đặt phòng của bạn.`);
          return prev;
        }
        
        // Calculate total capacity after adding this room
        const roomData = rooms.find(room => room.id === roomId);
        const totalCapacity = prev.reduce((sum, r) => {
          const room = rooms.find(rm => rm.id === r.roomId);
          return sum + (room.capacity * r.quantity);
        }, 0) + roomData.capacity;
        
        // Check if total capacity is sufficient when we reach max rooms
        if (totalRoomsSelected + 1 === filterData.rooms && totalCapacity < filterData.guests) {
          alert(`Tổng sức chứa của ${filterData.rooms} phòng phải đủ cho ${filterData.guests} khách. Hiện tại tổng chỉ có ${totalCapacity} người.`);
          return prev;
        }
        
        // Add new room type
        return [...prev, {roomId, quantity: 1}];
      }
    });
  }, [filterData.rooms, filterData.guests, rooms]);

  const handleBook = () => {
    if (selectedRooms.length > 0) {
      // Prepare rooms data with quantities
      const selectedRoomsData = selectedRooms.flatMap(({roomId, quantity}) => {
        const room = rooms.find(r => r.id === roomId);
        return Array(quantity).fill(room);
      }).filter(Boolean);
      
      const nights = calculateNights();
      
      // Calculate total
      const totalPrice = selectedRooms.reduce((sum, {roomId, quantity}) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return sum;
        const price = parseInt(room.price.replace(/[^\d]/g, ''));
        return sum + (price * nights * quantity);
      }, 0);
      
      const totalRoomsCount = selectedRooms.reduce((sum, r) => sum + r.quantity, 0);
      
      // Navigate to guest info page with booking data
      navigate('/guest-info', {
        state: {
          rooms: selectedRoomsData,
          roomCount: totalRoomsCount,
          checkIn: formatDateRange().split(' - ')[0],
          checkOut: formatDateRange().split(' - ')[1],
          guests: `${filterData.guests} adult${filterData.guests > 1 ? 's' : ''}`,
          nights: nights,
          total: `VND ${totalPrice.toLocaleString()}`,
          pricePerNight: selectedRoomsData[0]?.price
        }
      });
    }
  };

  const handleDeleteRoom = useCallback((roomId) => {
    setSelectedRooms(prev => {
      const room = prev.find(r => r.roomId === roomId);
      if (!room) return prev;
      
      if (room.quantity > 1) {
        // Decrease quantity by 1
        return prev.map(r => r.roomId === roomId ? {...r, quantity: r.quantity - 1} : r);
      } else {
        // Remove room completely
        return prev.filter(r => r.roomId !== roomId);
      }
    });
  }, []);

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

  // Prepare selected rooms data with quantities
  const selectedRoomsData = selectedRooms.flatMap(({roomId, quantity}) => {
    const room = rooms.find(r => r.id === roomId);
    // Create array with quantity of this room
    return Array(quantity).fill(room);
  }).filter(Boolean);

  // Calculate total rooms count
  const totalRoomsCount = selectedRooms.reduce((sum, r) => sum + r.quantity, 0);

  // Calculate total price
  const totalPrice = selectedRooms.reduce((sum, {roomId, quantity}) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return sum;
    const price = parseInt(room.price.replace(/[^\d]/g, ''));
    return sum + (price * nights * quantity);
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
        details: `${filterData.guests} guest${filterData.guests > 1 ? 's' : ''}, ${nights} night${nights > 1 ? 's' : ''}\nNon-refundable`,
        quantity: quantity
      };
    }),
    totalPrice: `VND ${totalPrice.toLocaleString()} total`,
    deposit: `Deposit: VND ${totalPrice.toLocaleString()}`
  } : {
    dates: formatDateRange(),
    rooms: `${filterData.rooms} room${filterData.rooms > 1 ? 's' : ''}, ${filterData.guests} guest${filterData.guests > 1 ? 's' : ''}`,
    nights: `${nights} night${nights > 1 ? 's' : ''}`
  };

  return (
    <div className="booking-page">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="booking-hero">
        <div className="hero-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="booking-content">
        <div className="booking-container">
          {/* Filter Section */}
          <div className="filter-section">
            <Filter 
              ref={filterRef}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Rooms and Booking Summary Layout */}
          <div className="booking-layout">
            {/* Rooms List */}
            <div className="rooms-list">
              {rooms.map((room) => {
                const selectedRoom = selectedRooms.find(r => r.roomId === room.id);
                const quantity = selectedRoom ? selectedRoom.quantity : 0;
                return (
                  <RoomBooking
                    key={room.id}
                    room={room}
                    variant={room.unavailable ? 'variant2' : 'default'}
                    isSelected={quantity > 0}
                    selectedQuantity={quantity}
                    unavailableDates={room.unavailable ? room.unavailableDates : null}
                    onSelect={() => !room.unavailable && handleRoomSelect(room.id)}
                    onOpenDatePicker={handleOpenDatePicker}
                  />
                );
              })}
            </div>

            {/* Booking Summary Sidebar */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BookingPage;
