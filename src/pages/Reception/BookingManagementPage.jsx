import { useState, useEffect } from 'react';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import BookingStatsCards from '../../components/Reception/BookingStatsCards';
import { getBookingsStatistic, getBookingsList, getBookingDetail, cancelBooking } from '../../api/bookingApi';
import BookingSearchFilter from '../../components/Reception/BookingSearchFilter';
import BookingTable from '../../components/Reception/BookingTable';
import BookingDetailsModal from '../../components/Reception/BookingDetailsModal';
import './BookingManagementPage.css';

function BookingManagementPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [apiStats, setApiStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Convert frontend status to backend format
  const convertStatusToBackend = (status) => {
    if (!status || status === 'all') return null;
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'inhouse': 'InHouse',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  // Fetch bookings list with details
  useEffect(() => {
    let mounted = true;
    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const statusFilter = convertStatusToBackend(selectedStatus);
        const keyword = searchQuery.trim() || null;
        
        console.log('🔍 Filter changed:', { selectedStatus, convertedTo: statusFilter, keyword });
        
        // Bước 1: Lấy danh sách booking cơ bản
        const result = await getBookingsList(statusFilter, keyword);
        
        if (!mounted) return;
        
        if (result.success && result.data) {
          console.log('Bookings list from backend:', result.data);
          
          // Bước 2: Với mỗi booking, gọi API detail để lấy typeDetails
          const detailPromises = result.data.map(booking => 
            getBookingDetail(booking.reservationId)
              .then(detailResult => ({
                ...booking,
                details: detailResult.success ? detailResult.data : null
              }))
              .catch(() => ({ ...booking, details: null }))
          );
          
          const bookingsWithDetails = await Promise.all(detailPromises);
          
          if (!mounted) return;
          
          console.log('Bookings with details:', bookingsWithDetails);
          
          // Bước 3: Map sang frontend format với đầy đủ thông tin
          const mappedBookings = bookingsWithDetails.map(booking => ({
            id: booking.reservationId,
            bookingDate: booking.reservationDate,
            customerName: booking.fullName,
            guestCount: booking.details?.countPeople || 0,
            phone: booking.phone,
            email: booking.email || '',
            rooms: booking.details?.typeDetails?.map(detail => ({
              type: detail.typeName,
              quantity: detail.count,
              price: detail.priceRoomPerNight,
              capacity: detail.capacity,
              detailId: detail.detailId
            })) || [],
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
            nights: booking.durationNights || 0,
            totalAmount: booking.totalAmount || 0,
            status: booking.statusReservation?.toLowerCase() || 'pending',
            // Thêm các field bổ sung
            totalDue: booking.totalDue || 0,
            depositAmount: booking.details?.depositAmount || 0,
            paidAmount: booking.details?.paidAmount || 0,
            totalPaid: booking.details?.totalPaid || 0,
            statusPayment: booking.statusPayment,
            roomCount: booking.roomCount || 0,
            totalService: booking.details?.totalService || 0,
            totalRoom: booking.details?.totalRoom || 0
          }));
          
          setBookings(mappedBookings);
        } else {
          console.warn('Bookings not available:', result.message);
          setBookings([]);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings([]);
      } finally {
        if (mounted) setBookingsLoading(false);
      }
    };

    fetchBookings();
    return () => { mounted = false; };
  }, [selectedStatus, searchQuery]);

  // Fetch statistics
  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const result = await getBookingsStatistic();
        
        if (!mounted) return;
        
        if (result.success && result.data) {
          const data = result.data;
          console.log('Raw statistics from backend:', data);
          
          // Map từ backend keys sang frontend format
          const mappedStats = {
            all: data.All || data.all || 0,
            pending: data.Pending || data.pending || 0,
            confirmed: data.Confirmed || data.confirmed || 0,
            checkedIn: data.InHouse || data.CheckedIn || data.checkedIn || 0,
            completed: data.Completed || data.completed || 0,
            cancelled: data.Cancelled || data.cancelled || 0
          };
          
          setApiStats(mappedStats);
          console.log('Mapped statistics:', mappedStats);
        } else {
          console.warn('Statistics not available:', result.message);
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
      } finally {
        if (mounted) setStatsLoading(false);
      }
    };

    fetchStats();
    return () => { mounted = false; };
  }, []);

  const getStats = () => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      checkedIn: bookings.filter(b => b.status === 'inhouse').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
  };

  // API đã filter rồi nên không cần filter lại ở client
  const filteredBookings = bookings;

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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn đặt phòng này?')) {
      return;
    }

    try {
      const result = await cancelBooking(bookingId);
      
      if (result.success) {
        alert('Hủy đơn đặt phòng thành công!');
        handleCloseModal();
        
        // Refresh danh sách bookings
        const statusFilter = convertStatusToBackend(selectedStatus);
        const keyword = searchQuery.trim() || null;
        const listResult = await getBookingsList(statusFilter, keyword);
        
        if (listResult.success && listResult.data) {
          const detailPromises = listResult.data.map(booking => 
            getBookingDetail(booking.reservationId)
              .then(detailResult => ({
                ...booking,
                details: detailResult.success ? detailResult.data : null
              }))
              .catch(() => ({ ...booking, details: null }))
          );
          
          const bookingsWithDetails = await Promise.all(detailPromises);
          
          const mappedBookings = bookingsWithDetails.map(booking => ({
            id: booking.reservationId,
            bookingDate: booking.reservationDate,
            customerName: booking.fullName,
            guestCount: booking.details?.countPeople || 0,
            phone: booking.phone,
            email: booking.email || '',
            rooms: booking.details?.typeDetails?.map(detail => ({
              type: detail.typeName,
              quantity: detail.count,
              price: detail.priceRoomPerNight,
              capacity: detail.capacity,
              detailId: detail.detailId
            })) || [],
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
            nights: booking.durationNights || 0,
            totalAmount: booking.totalAmount || 0,
            status: booking.statusReservation?.toLowerCase() || 'pending',
            totalDue: booking.totalDue || 0,
            depositAmount: booking.details?.depositAmount || 0,
            paidAmount: booking.details?.paidAmount || 0,
            totalPaid: booking.details?.totalPaid || 0,
            statusPayment: booking.statusPayment,
            roomCount: booking.roomCount || 0,
            totalService: booking.details?.totalService || 0,
            totalRoom: booking.details?.totalRoom || 0
          }));
          
          setBookings(mappedBookings);
        }
        
        // Refresh statistics
        const statsResult = await getBookingsStatistic();
        if (statsResult.success && statsResult.data) {
          const data = statsResult.data;
          const mappedStats = {
            all: data.All || data.all || 0,
            pending: data.Pending || data.pending || 0,
            confirmed: data.Confirmed || data.confirmed || 0,
            checkedIn: data.InHouse || data.CheckedIn || data.checkedIn || 0,
            completed: data.Completed || data.completed || 0,
            cancelled: data.Cancelled || data.cancelled || 0
          };
          setApiStats(mappedStats);
        }
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert('Có lỗi xảy ra khi hủy đơn đặt phòng!');
    }
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
            stats={apiStats || getStats()} 
            selectedStatus={selectedStatus}
            onStatusClick={setSelectedStatus}
          />

          <BookingSearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            stats={apiStats || getStats()}
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
