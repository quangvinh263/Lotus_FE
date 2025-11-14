import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/RoomsPage.css';
import Navbar from '../../components/NavBar';
import Footer from '../../components/Footer';
import RoomSection from '../../components/RoomSection';
import ImageRoomsPage from '../../assets/images/ImageRoomsPage.jpg';

const RoomsPage = () => {
  const navigate = useNavigate();

  // Sample room data - you can replace with actual data
  const rooms = [
    {
      id: 1,
      roomType: "SUPERIOR ROOM",
      price: "USD200",
      description: "A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.",
      roomSize: "32 sqm",
      beds: "1 King bed or 2 Single beds",
      maxOccupancy: "2 pax",
      view: "City view",
      smoking: "No",
      bathroom: "Toilet, washbasin, and shower"
    },
    {
      id: 2,
      roomType: "SUPERIOR ROOM",
      price: "USD200",
      description: "A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.",
      roomSize: "32 sqm",
      beds: "1 King bed or 2 Single beds",
      maxOccupancy: "2 pax",
      view: "City view",
      smoking: "No",
      bathroom: "Toilet, washbasin, and shower"
    },
    {
      id: 3,
      roomType: "SUPERIOR ROOM",
      price: "USD200",
      description: "A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.",
      roomSize: "32 sqm",
      beds: "1 King bed or 2 Single beds",
      maxOccupancy: "2 pax",
      view: "City view",
      smoking: "No",
      bathroom: "Toilet, washbasin, and shower"
    },
    {
      id: 4,
      roomType: "SUPERIOR ROOM",
      price: "USD200",
      description: "A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.",
      roomSize: "32 sqm",
      beds: "1 King bed or 2 Single beds",
      maxOccupancy: "2 pax",
      view: "City view",
      smoking: "No",
      bathroom: "Toilet, washbasin, and shower"
    },
    {
      id: 5,
      roomType: "SUPERIOR ROOM",
      price: "USD200",
      description: "A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.",
      roomSize: "32 sqm",
      beds: "1 King bed or 2 Single beds",
      maxOccupancy: "2 pax",
      view: "City view",
      smoking: "No",
      bathroom: "Toilet, washbasin, and shower"
    },
    {
      id: 6,
      roomType: "SUPERIOR ROOM",
      price: "USD200",
      description: "A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.",
      roomSize: "32 sqm",
      beds: "1 King bed or 2 Single beds",
      maxOccupancy: "2 pax",
      view: "City view",
      smoking: "No",
      bathroom: "Toilet, washbasin, and shower"
    },
    {
      id: 7,
      roomType: "SUPERIOR ROOM",
      price: "USD200",
      description: "A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.",
      roomSize: "32 sqm",
      beds: "1 King bed or 2 Single beds",
      maxOccupancy: "2 pax",
      view: "City view",
      smoking: "No",
      bathroom: "Toilet, washbasin, and shower"
    },
    {
      id: 8,
      roomType: "SUPERIOR ROOM",
      price: "USD200",
      description: "A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration.",
      roomSize: "32 sqm",
      beds: "1 King bed or 2 Single beds",
      maxOccupancy: "2 pax",
      view: "City view",
      smoking: "No",
      bathroom: "Toilet, washbasin, and shower"
    }
  ];

  const handleBookRoom = (roomId) => {
    console.log('Book room:', roomId);
    // Add booking logic here
  };

  const handleMoreInfo = (roomId) => {
    navigate(`/room-details/${roomId}`);
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

      {/* Rooms Grid */}
      <div className="rooms-grid">
        {rooms.map((room) => (
          <RoomSection
            key={room.id}
            roomType={room.roomType}
            price={room.price}
            description={room.description}
            roomSize={room.roomSize}
            beds={room.beds}
            maxOccupancy={room.maxOccupancy}
            view={room.view}
            smoking={room.smoking}
            bathroom={room.bathroom}
            onBookRoom={() => handleBookRoom(room.id)}
            onMoreInfo={() => handleMoreInfo(room.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RoomsPage;
