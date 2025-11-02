import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BookingPage.css';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Filter from '../components/Filter';
import RoomBooking from '../components/RoomBooking';
import BookingSummary from '../components/BookingSummary';

const BookingPage = () => {
  const navigate = useNavigate();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [filterData, setFilterData] = useState({
    checkInDate: new Date(2025, 9, 18), // Oct 18, 2025
    checkOutDate: new Date(2025, 9, 19), // Oct 19, 2025
    rooms: 1,
    guests: 2
  });
  const filterRef = useRef(null);

  // Sample room data - in real app this would come from API
  const rooms = [
    {
      id: 1,
      name: 'Superior Room',
      price: 'VND 5,000,000',
      priceDescription: 'Cost for 1 night, 2 guests',
      capacity: 'Sleeps 2',
      bedType: '2 Single beds',
      bathroom: '1 Bathroom',
      description: `32m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

        A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.`
    },
    {
      id: 2,
      name: 'Superior Room',
      price: 'VND 5,000,000',
      priceDescription: 'Cost for 1 night, 2 guests',
      capacity: 'Sleeps 2',
      bedType: '2 Single beds',
      bathroom: '1 Bathroom',
      description: `32m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

        A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.`
    },
    {
      id: 3,
      name: 'Superior Room',
      price: 'VND 5,000,000',
      priceDescription: 'Cost for 1 night, 2 guests',
      capacity: 'Sleeps 2',
      bedType: '2 Single beds',
      bathroom: '1 Bathroom',
      description: `32m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

        A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.`
    },
    {
      id: 4,
      name: 'Superior Room',
      price: 'VND 5,000,000',
      priceDescription: 'Cost for 1 night, 2 guests',
      capacity: 'Sleeps 2',
      bedType: '2 Single beds',
      bathroom: '1 Bathroom',
      description: `32m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

                A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.`
    },
    {
      id: 5,
      name: 'Superior Room',
      price: 'VND 5,000,000',
      priceDescription: 'Cost for 1 night, 2 guests',
      capacity: 'Sleeps 2',
      bedType: '2 Single beds',
      bathroom: '1 Bathroom',
      description: `32m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

        A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.`
    },
    {
      id: 6,
      name: 'Superior Room',
      price: 'VND 5,000,000',
      priceDescription: 'Cost for 1 night, 2 guests',
      capacity: 'Sleeps 2',
      bedType: '2 Single beds',
      bathroom: '1 Bathroom',
      description: `32m² • City view • Non-smoking • Shower • Internet Access • Smart TV • Alarm Clock • Daily Room Service • Television • Desk • Telephone • Hairdryer • Air conditioned • Mini Bar • Room Safe • Housekeeping • Wireless Internet • Free Toiletries

        A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.`,
      unavailable: true,
      unavailableDates: 'Sat, 18 Oct - Sun, 19 Oct'
    }
  ];

  const handleFilterChange = (newFilterData) => {
    setFilterData(newFilterData);
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRooms(prev => {
      // Check if room already selected
      if (prev.includes(roomId)) {
        // Remove it
        return prev.filter(id => id !== roomId);
      } else {
        // Add it
        return [...prev, roomId];
      }
    });
  };

  const handleBook = () => {
    if (selectedRooms.length > 0) {
      const selectedRoomsData = rooms.filter(room => selectedRooms.includes(room.id));
      const nights = calculateNights();
      
      // Calculate total
      const totalPrice = selectedRoomsData.reduce((sum, room) => {
        const price = parseInt(room.price.replace(/[^\d]/g, ''));
        return sum + (price * nights);
      }, 0);
      
      // Navigate to guest info page with booking data
      navigate('/guest-info', {
        state: {
          rooms: selectedRoomsData,
          roomCount: selectedRooms.length,
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

  const handleDeleteRoom = (roomId) => {
    setSelectedRooms(prev => prev.filter(id => id !== roomId));
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

  // Prepare selected rooms data
  const selectedRoomsData = selectedRooms.map(roomId => {
    const room = rooms.find(r => r.id === roomId);
    return room;
  }).filter(Boolean);

  // Calculate total price
  const totalPrice = selectedRoomsData.reduce((sum, room) => {
    const price = parseInt(room.price.replace(/[^\d]/g, ''));
    return sum + (price * nights);
  }, 0);

  const bookingData = selectedRooms.length > 0 ? {
    dates: formatDateRange(),
    rooms: `${selectedRooms.length} room${selectedRooms.length > 1 ? 's' : ''}, ${filterData.guests} guest${filterData.guests > 1 ? 's' : ''}`,
    nights: `${nights} night${nights > 1 ? 's' : ''}`,
    selectedRooms: selectedRoomsData.map(room => ({
      id: room.id,
      name: room.name,
      price: room.price,
      details: `${filterData.guests} guest${filterData.guests > 1 ? 's' : ''}, ${nights} night${nights > 1 ? 's' : ''}\nNon-refundable`
    })),
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
              {rooms.map((room) => (
                <RoomBooking
                  key={room.id}
                  variant={room.unavailable ? 'variant2' : 'default'}
                  isSelected={selectedRooms.includes(room.id)}
                  unavailableDates={room.unavailable ? room.unavailableDates : null}
                  onSelect={() => !room.unavailable && handleRoomSelect(room.id)}
                  onOpenDatePicker={handleOpenDatePicker}
                />
              ))}
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
