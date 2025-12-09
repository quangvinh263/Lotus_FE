import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/RoomsPage.css';
import Navbar from '../../components/Public/NavBar';
import Footer from '../../components/Public/Footer';
import RoomSection from '../../components/Public/RoomSection';
import ImageRoomsPage from '../../assets/images/ImageRoomsPage.jpg';
import { getRoomOverview } from '../../api/roomTypeApi';
import { toast } from 'react-toastify';

const RoomsPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        console.log('📡 Fetching room overview...');
        
        const response = await getRoomOverview();
        
        console.log('✅ Room overview response:', response);
        
        // Check if response has success flag and overview array
        if (response.success && Array.isArray(response.overview)) {
          console.log('📦 Rooms data:', response.overview);
          setRooms(response.overview);
        } else {
          console.error('❌ Invalid response format:', response);
          toast.error('Failed to load rooms data');
        }
      } catch (error) {
        console.error('❌ Error fetching rooms:', error);
        toast.error('Failed to load rooms. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleBookRoom = (roomTypeId) => {
    console.log('Book room:', roomTypeId);
    navigate('/booking', { state: { roomTypeId } });
  };

  const handleMoreInfo = (roomTypeId) => {
    console.log('More info for room:', roomTypeId);
    navigate(`/room-details/${roomTypeId}`);
  };

  // Format price from VND to display format
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="rooms-page">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Image */}
      <div className="rooms-hero">
        <img src={ImageRoomsPage} alt="Rooms" className="rooms-hero-image" />
        <div className="rooms-hero-overlay"></div>
      </div>

      {/* Page Heading */}
      <div className="rooms-heading">
        <h1>Rooms & Suites</h1>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rooms-loading">
          <div className="loading-spinner"></div>
          <p>Loading rooms...</p>
        </div>
      )}

      {/* Rooms Grid */}
      {!isLoading && rooms.length > 0 && (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomSection
              key={room.roomTypeId}
              roomType={room.roomTypeName}
              price={formatPrice(room.basePrice)}
              description={room.description}
              roomSize={`${room.square} sqm`}
              beds="1 King bed or 2 Single beds"
              maxOccupancy={`${room.capacity} pax`}
              view="City view"
              smoking="No"
              bathroom="Toilet, washbasin, and shower"
              imageUrl={room.urlImage}
              onBookRoom={() => handleBookRoom(room.roomTypeId)}
              onMoreInfo={() => handleMoreInfo(room.roomTypeId)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && rooms.length === 0 && (
        <div className="rooms-empty">
          <p>No rooms available at the moment.</p>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RoomsPage;
