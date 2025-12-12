import React, { useState, useEffect, useContext } from 'react';
import '../../styles/ProfilePage.css';
import Navbar from '../../components/Public/NavBar';
import Footer from '../../components/Public/Footer';
import PersonalInfo from '../../components/Public/PersonalInfo';
import BookingCard from '../../components/Public/BookingCard';
import ChangePassword from '../../components/ChangePassword';
import ImageHome1 from '../../assets/images/ImageHome1.png';
import { getUpcomingBookings, getPastBookings } from '../../api/bookingApi';
import { getPersonalInfo } from '../../api/customerApi';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const { auth } = useContext(AuthContext);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  // Hàm helper để map dữ liệu (tránh lặp code)
  const mapBookingData = (data) => {
    return data.map(booking => {
      const firstDetail = booking.typeDetails && booking.typeDetails.length > 0 
        ? booking.typeDetails[0] 
        : null;

      const totalGuests = booking.typeDetails 
        ? booking.typeDetails.reduce((sum, detail) => sum + (detail.capacity * detail.count), 0)
        : booking.countPeople;

      return {
        id: booking.reservationId,
        hotelName: firstDetail?.typeName || "Lotus Premium Hotel",
        location: "Ho Chi Minh City, Vietnam",
        image: firstDetail?.imageUrl || ImageHome1,
        checkIn: new Date(booking.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        checkOut: new Date(booking.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        guests: totalGuests,
        rooms: booking.roomCount,
        status: booking.statusReservation,
        totalAmount: booking.totalAmount
      };
    });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const accountId = auth?.accountId || auth?.user?.accountId;

      if (!accountId) {
        console.log("Chưa có thông tin accountId, đợi auth load...");
        return;
      }

      try {
        // 1. Lấy thông tin Customer để có customerId
        const customerRes = await getPersonalInfo(accountId);
        
        if (customerRes.success && customerRes.data) {
          const customerId = customerRes.data.customerId;
          console.log("Customer ID:", customerId);

          // 2. Gọi API lấy booking sắp tới (SỬA: Dùng customerId)
          const bookingsRes = await getUpcomingBookings(accountId);
          console.log("Upcoming Bookings:", bookingsRes);

          if (bookingsRes.success && Array.isArray(bookingsRes.data)) {
            setUpcomingBookings(mapBookingData(bookingsRes.data));
          }

          // 3. Lấy booking đã qua (SỬA: Dùng customerId)
          const pastBookingsRes = await getPastBookings(accountId);
          console.log("Past Bookings:", pastBookingsRes);

          if (pastBookingsRes.success && Array.isArray(pastBookingsRes.data)) {
            setPastBookings(mapBookingData(pastBookingsRes.data));
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách đặt phòng:", error);
      }
    };

    fetchBookings();
  }, [auth]);

  const handleCancelBooking = (bookingId) => {
    console.log('Cancelling booking:', bookingId);
    alert('Booking cancelled successfully!');
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-content">
          <PersonalInfo />
          <ChangePassword />
          
          <div className="bookings-section">
            <div className="upcoming-reservations">
              <h2>Upcoming Reservations</h2>
              <div className="booking-cards-container">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map(booking => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking}
                      onCancelBooking={handleCancelBooking}
                    />
                  ))
                ) : (
                  <p style={{ color: '#666', fontFamily: 'EB Garamond', padding: '20px' }}>
                    No upcoming reservations found.
                  </p>
                )}
              </div>
            </div>
            
            <div className="past-stays">
              <h2>Past Stays</h2>
              <div className="booking-cards-container">
                {pastBookings.length > 0 ? (
                  pastBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      // Không truyền onCancelBooking cho lịch sử
                    />
                  ))
                ) : (
                  <p style={{ color: '#666', fontFamily: 'EB Garamond', padding: '20px' }}>
                    No past stays found.
                  </p>
                )}
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
