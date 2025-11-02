import React, { useEffect } from 'react';
import '../styles/RoomDetailsPage.css';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import RoomDetailSection from '../components/RoomDetailSection';
import ImageRoomDetailsPage from '../assets/images/ImageRoomDetailsPage.jpg';

const RoomDetailsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBookRoom = () => {
    console.log('Book room clicked');
    // Add booking logic here
  };

  return (
    <div className="room-details-page">
      {/* Navbar */}
      <Navbar />

      {/* Hero Image */}
      <div className="room-details-hero">
        <img src={ImageRoomDetailsPage} alt="Room Details" className="room-details-hero-image" />
        <div className="room-details-hero-overlay"></div>
      </div>

      {/* Room Detail Section */}
      <RoomDetailSection
        roomType="Superior Rooms"
        price="USD200"
        description="A cozy retreat designed for comfort, offering a peaceful space to unwind after a day of exploration."
        roomSize="32 sqm"
        beds="1 King bed or 2 Single beds"
        maxOccupancy="2 pax"
        view="City view"
        smoking="No"
        bathroom="Toilet, washbasin, and shower"
        onBookRoom={handleBookRoom}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RoomDetailsPage;
