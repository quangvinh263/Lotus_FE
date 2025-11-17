import React from 'react';
import '../../styles/ProfilePage.css';
import Navbar from '../../components/Public/NavBar';
import Footer from '../../components/Public/Footer';
import ProfileHeader from '../../components/Public/ProfileHeader';
import PersonalInfo from '../../components/Public/PersonalInfo';
import BookingCard from '../../components/Public/BookingCard';
import ChangePassword from '../../components/ChangePassword';
import SettingIcon from '../../assets/icons/SettingIcon.svg';
import ImageHome1 from '../../assets/images/ImageHome1.png';
import ImageHome2 from '../../assets/images/ImageHome2.png';
import ImageHome3 from '../../assets/images/ImageHome3.png';

const ProfilePage = () => {
  const upcomingBookings = [
    {
      id: 1,
      hotelName: "Grand Hotel & Spa",
      location: "New York, NY",
      image: ImageHome1,
      checkIn: "Dec 15, 2025",
      checkOut: "Dec 18, 2025",
      guests: 2,
      rooms: 1,
      status: "Upcoming"
    },
    {
      id: 2,
      hotelName: "Seaside Resort & Marina",
      location: "Miami Beach, FL",
      image: ImageHome2,
      checkIn: "Jan 5, 2026",
      checkOut: "Jan 10, 2026",
      guests: 4,
      rooms: 2,
      status: "Upcoming"
    }
  ];

  const pastBookings = [
    {
      id: 3,
      hotelName: "Downtown Business Hotel",
      location: "Chicago, IL",
      image: ImageHome3,
      checkIn: "Sep 10, 2025",
      checkOut: "Sep 13, 2025",
      guests: 1,
      rooms: 1,
      isPast: true
    },
    {
      id: 4,
      hotelName: "Mountain View Lodge",
      location: "Aspen, CO",
      image: ImageHome1,
      checkIn: "Jul 20, 2025",
      checkOut: "Jul 25, 2025",
      guests: 3,
      rooms: 2,
      isPast: true
    }
  ];

  const handleCancelBooking = (bookingId) => {
    console.log('Cancelling booking:', bookingId);
    // Add your cancel booking logic here
    alert('Booking cancelled successfully!');
  };

  return (
    <div className="profile-page">
      <Navbar />
      <ProfileHeader />
      
      <div className="profile-container">
        <div className="profile-content">
          <PersonalInfo />
          <ChangePassword />
          
          <div className="bookings-section">
            <div className="upcoming-reservations">
              <h2>Upcoming Reservations</h2>
              <div className="booking-cards-container">
                {upcomingBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking}
                    onCancelBooking={handleCancelBooking}
                  />
                ))}
              </div>
            </div>
            
            <div className="past-stays">
              <h2>Past Stays</h2>
              <div className="booking-cards-container">
                {pastBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking}
                    onCancelBooking={handleCancelBooking}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
