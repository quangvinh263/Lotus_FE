import { useState } from 'react';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import BookingStatsCards from '../../components/Reception/BookingStatsCards';
import BookingSearchFilter from '../../components/Reception/BookingSearchFilter';
import BookingTable from '../../components/Reception/BookingTable';
import BookingDetailsModal from '../../components/Reception/BookingDetailsModal';
import './BookingManagementPage.css';

function BookingManagementPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Sample booking data
  const [bookings] = useState([
    {
      id: 'BK001',
      bookingDate: '1/11/2025',
      customerName: 'Nguyễn Văn An',
      guestCount: 4,
      phone: '0901234567',
      email: 'an.nguyen@email.com',
      rooms: [
        { type: 'Deluxe', quantity: 1 },
        { type: 'Standard', quantity: 1 }
      ],
      checkIn: '5/11/2025',
      checkOut: '8/11/2025',
      nights: 3,
      totalAmount: 7500000,
      status: 'confirmed'
    },
    {
      id: 'BK002',
      bookingDate: '28/10/2025',
      customerName: 'Trần Thị Bình',
      guestCount: 2,
      phone: '0912345678',
      email: 'binh.tran@email.com',
      rooms: [
        { type: 'Suite', quantity: 1 }
      ],
      checkIn: '3/11/2025',
      checkOut: '5/11/2025',
      nights: 2,
      totalAmount: 6000000,
      status: 'checked-in'
    },
    {
      id: 'BK003',
      bookingDate: '2/11/2025',
      customerName: 'Lê Minh Châu',
      guestCount: 4,
      phone: '0923456789',
      email: 'chau.le@email.com',
      rooms: [
        { type: 'Standard', quantity: 2 }
      ],
      checkIn: '10/11/2025',
      checkOut: '12/11/2025',
      nights: 2,
      totalAmount: 4000000,
      status: 'pending'
    },
    {
      id: 'BK004',
      bookingDate: '25/10/2025',
      customerName: 'Phạm Quốc Dũng',
      guestCount: 2,
      phone: '0934567890',
      email: 'dung.pham@email.com',
      rooms: [
        { type: 'Deluxe', quantity: 1 }
      ],
      checkIn: '28/10/2025',
      checkOut: '1/11/2025',
      nights: 4,
      totalAmount: 4500000,
      status: 'completed'
    },
    {
      id: 'BK005',
      bookingDate: '30/10/2025',
      customerName: 'Hoàng Thị Em',
      guestCount: 1,
      phone: '0945678901',
      email: 'em.hoang@email.com',
      rooms: [
        { type: 'Standard', quantity: 1 }
      ],
      checkIn: '15/11/2025',
      checkOut: '17/11/2025',
      nights: 2,
      totalAmount: 2000000,
      status: 'cancelled'
    }
  ]);

  const getStats = () => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      checkedIn: bookings.filter(b => b.status === 'checked-in').length,
      completed: bookings.filter(b => b.status === 'completed').length
    };
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  const handleConfirmBooking = (bookingId) => {
    console.log('Confirm booking:', bookingId);
    // TODO: Implement confirm booking logic
    handleCloseModal();
  };

  const handleCancelBooking = (bookingId) => {
    console.log('Cancel booking:', bookingId);
    // TODO: Implement cancel booking logic
    handleCloseModal();
  };

  return (
    <div className="bmp-container">
      <Sidebar activePage="booking-management" />
      <div className="bmp-main">
        <TopBar />
        <div className="bmp-content">
          <div className="bmp-header">
            <h1 className="bmp-title">Quản lý đặt phòng</h1>
            <p className="bmp-description">Xem và quản lý tất cả các đơn đặt phòng trong hệ thống</p>
          </div>

          <BookingStatsCards 
            stats={getStats()} 
            selectedStatus={selectedStatus}
            onStatusClick={setSelectedStatus}
          />

          <BookingSearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            totalBookings={filteredBookings.length}
          />

          <BookingTable 
            bookings={filteredBookings}
            onViewBooking={handleViewBooking}
            onConfirmBooking={handleConfirmBooking}
            onCancelBooking={handleCancelBooking}
          />
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={handleCloseModal}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancelBooking}
        />
      )}
    </div>
  );
}

export default BookingManagementPage;
