import React, { useState, useEffect } from 'react';
import './CheckOutManagement.css';
import Sidebar from '../../components/Reception/Sidebar';
import TopBar from '../../components/Reception/TopBar';
import CheckOutCard from '../../components/Reception/CheckOutCard';
import CheckOutModal from '../../components/Reception/CheckOutModal';
import InvoicePaymentModal from '../../components/Reception/InvoicePaymentModal';
import { getBookingsList, getBookingDetail, checkOutBooking } from '../../api/bookingApi';
import { processManualPayment, processZaloPayPayment } from '../../api/paymentApi';
import SearchIcon from '../../assets/icons/SearchIcon.svg';

const CheckOutManagement = () => {
  const [searchType, setSearchType] = useState('booking'); // 'booking' or 'room'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [preselectedRoomIndices, setPreselectedRoomIndices] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  // Fetch InHouse reservations on mount
  useEffect(() => {
    fetchInHouseReservations();
  }, []);

  const fetchInHouseReservations = async () => {
    setLoading(true);
    console.log('📤 Fetching InHouse reservations...');
    
    try {
      // Get list of InHouse reservations
      const listResult = await getBookingsList('InHouse', null);
      
      if (!listResult.success) {
        console.error('❌ Failed to fetch reservations:', listResult.message);
        alert(listResult.message);
        setLoading(false);
        return;
      }

      console.log('📥 InHouse reservations list:', listResult.data);

      // Fetch details for each reservation
      const detailPromises = listResult.data.map(reservation => 
        getBookingDetail(reservation.reservationId)
      );

      const detailResults = await Promise.all(detailPromises);
      
      // Map API response to component format
      const mappedCheckouts = detailResults
        .filter(result => result.success)
        .map(result => {
          const detail = result.data;
          
          return {
            reservationId: detail.reservationId,
            reservationCode: detail.reservationId,
            customerId: detail.fullName,
            customerName: detail.fullName,
            phone: detail.phone || 'N/A',
            checkInDate: formatDate(detail.checkInDate),
            checkOutDate: formatDate(detail.checkOutDate),
            status: detail.statusReservation,
            totalAmount: detail.totalAmount,
            isPaid: detail.totalDue === 0,
            reservationDetails: detail.rooms.flatMap(room => 
              room.reservationDetails
                .filter(rd => rd.status === 'CheckedIn')
                .map(rd => {
                  // Get services for this reservation detail
                  const services = detail.serviceDetails
                    .filter(svc => svc.reservationDetailId === rd.reservationDetailId)
                    .map(svc => ({
                      serviceId: svc.serviceId,
                      name: svc.service?.serviceName || svc.serviceId,
                      price: svc.total,
                      quantity: svc.quantity
                    }));
                  
                  // Calculate service total for this room
                  const serviceTotal = services.reduce((sum, svc) => sum + svc.price, 0);
                  
                  return {
                    reservationDetailId: rd.reservationDetailId,
                    roomNumber: room.roomNumber,
                    roomType: rd.type?.typeName || 'N/A',
                    pricePerNight: rd.priceAtBooking / detail.durationNights,
                    nights: detail.durationNights,
                    checkInDate: formatDate(rd.checkInDate),
                    checkOutDate: formatDate(rd.checkOutDate),
                    actualCheckOutDate: rd.actualCheckOut ? formatDate(rd.actualCheckOut) : null,
                    services: services,
                    subtotal: rd.priceAtBooking + serviceTotal
                  };
                })
            )
          };
        });

      console.log('📥 Mapped checkouts:', mappedCheckouts);
      setCheckouts(mappedCheckouts);
      
    } catch (error) {
      console.error('❌ Error fetching InHouse reservations:', error);
      alert('Có lỗi xảy ra khi tải danh sách check-out');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleCheckOutAll = (reservation) => {
    setSelectedBooking(reservation);
    // Chọn tất cả các phòng (tạo array [0, 1, 2, ...])
    setPreselectedRoomIndices(reservation.reservationDetails.map((_, index) => index));
    setIsModalOpen(true);
  };

  const handleRoomClick = (reservation, roomIndex) => {
    setSelectedBooking(reservation);
    setPreselectedRoomIndices([roomIndex]);
    setIsModalOpen(true);
  };

  const handleConfirmCheckOut = async (selectedRoomDetailsData) => {
    try {
      const detailIds = selectedRoomDetailsData.map(detail => detail.reservationDetailId);
      
      console.log('📤 Calling API to check-out rooms:', {
        reservationId: selectedBooking.reservationId,
        reservationDetailIds: detailIds,
        count: detailIds.length
      });
      
      // Call check-out API for each room individually
      let successCount = 0;
      let lastInvoice = null;
      let hasError = false;
      
      for (const detailId of detailIds) {
        const result = await checkOutBooking(detailId);
        
        if (!result.success) {
          console.error('❌ Check-out failed for detail:', detailId, result.message);
          alert(`Không thể check-out phòng ${detailId}: ${result.message}`);
          hasError = true;
          break;
        }
        
        successCount++;
        console.log(`✅ Check-out successful for detail ${detailId}:`, result.data);
        
        // Store invoice if created (last guest checkout)
        if (result.data?.generatedInvoice) {
          lastInvoice = result.data.generatedInvoice;
        }
      }
      
      if (hasError) {
        // If error occurred, refresh data to get current state
        await fetchInHouseReservations();
        setIsModalOpen(false);
        return;
      }
      
      // Check if fully checked out (all rooms)
      const remainingDetails = selectedBooking.reservationDetails.filter(
        detail => !detailIds.includes(detail.reservationDetailId)
      );
      
      if (remainingDetails.length === 0) {
        console.log('✅ Full check-out completed - Invoice created');
        
        // Show invoice modal if invoice was generated
        if (lastInvoice) {
          setCurrentInvoice(lastInvoice);
          setIsInvoiceModalOpen(true);
          // Close checkout modal, keep invoice modal open
          setIsModalOpen(false);
        } else {
          alert('Check-out thành công!');
          setIsModalOpen(false);
          setSelectedBooking(null);
          setPreselectedRoomIndices([]);
        }
      } else {
        console.log('⚠️ Partial check-out - Remaining rooms:', remainingDetails.length);
        alert(`Check-out ${successCount} phòng thành công! Còn ${remainingDetails.length} phòng chưa check-out.`);
        
        // Update UI for partial checkout
        setCheckouts(prevCheckouts => {
          return prevCheckouts.map(reservation => {
            if (reservation.reservationId === selectedBooking.reservationId) {
              return {
                ...reservation,
                reservationDetails: remainingDetails,
                status: 'PartialCheckout'
              };
            }
            return reservation;
          });
        });
        
        setIsModalOpen(false);
        setSelectedBooking(null);
        setPreselectedRoomIndices([]);
      }
      
      // Optionally refresh data from server
      // await fetchInHouseReservations();
      
    } catch (error) {
      console.error('❌ Error during checkout:', error);
      alert('Có lỗi xảy ra khi check-out. Vui lòng thử lại.');
    }
  };

  const handlePayment = async (invoiceId, paymentMethod) => {
    try {
      console.log('💳 Processing payment:', { invoiceId, paymentMethod });
      
      let result;
      
      if (paymentMethod === 'cash') {
        // Manual payment (cash)
        const amount = currentInvoice.amountDue;
        result = await processManualPayment(invoiceId, amount, {
          method: 'Cash',
          transactionRef: null,
          payerName: null,
          payerPhone: null,
          note: null,
          bankCode: null
        });
        
        if (!result.success) {
          alert(`Lỗi thanh toán: ${result.message}`);
          return;
        }
        
        alert('Thanh toán tiền mặt thành công!');
        
      } else if (paymentMethod === 'zalopay') {
        // ZaloPay payment
        result = await processZaloPayPayment(invoiceId);
        
        if (!result.success) {
          alert(`Lỗi tạo link ZaloPay: ${result.message}`);
          return;
        }
        
        // Open ZaloPay payment URL if available
        if (result.data?.paymentUrl || result.data?.orderUrl) {
          const paymentUrl = result.data.paymentUrl || result.data.orderUrl;
          window.open(paymentUrl, '_blank');
          alert('Đã mở link thanh toán ZaloPay. Vui lòng hoàn tất thanh toán trên trang ZaloPay.');
        } else {
          alert('Đã tạo yêu cầu thanh toán ZaloPay thành công!');
        }
      }
      
      // Close both modals
      setIsInvoiceModalOpen(false);
      setIsModalOpen(false);
      setCurrentInvoice(null);
      setSelectedBooking(null);
      setPreselectedRoomIndices([]);
      
      // Refresh data to update status
      await fetchInHouseReservations();
      
    } catch (error) {
      console.error('❌ Payment error:', error);
      alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
    }
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setIsModalOpen(false);
    setCurrentInvoice(null);
    setSelectedBooking(null);
    setPreselectedRoomIndices([]);
    
    // Refresh data after closing invoice
    fetchInHouseReservations();
  };

  const filteredCheckouts = checkouts.filter(reservation => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    if (searchType === 'booking') {
      return (
        reservation.reservationCode.toLowerCase().includes(query) ||
        reservation.customerName.toLowerCase().includes(query) ||
        reservation.phone.includes(query)
      );
    } else {
      return reservation.reservationDetails.some(detail => 
        detail.roomNumber.toLowerCase().includes(query)
      );
    }
  });

  return (
    <div className="checkout-management">
      <Sidebar variant="checkout" />
      <div className="checkout-main-content">
        <TopBar />
        
        <div className="checkout-content-area">
          <div className="checkout-header">
            <h1 className="checkout-title">Quản lý Check-out</h1>
            <p className="checkout-subtitle">Tìm kiếm khách đang ở và tạo hóa đơn check-out</p>
          </div>

          <div className="checkout-search-section">
            <h2 className="checkout-search-title">Tìm kiếm</h2>
            
            <div className="checkout-search-tabs">
              <button 
                className={`checkout-tab ${searchType === 'booking' ? 'active' : ''}`}
                onClick={() => setSearchType('booking')}
              >
                Tìm theo đơn đặt phòng
              </button>
              <button 
                className={`checkout-tab ${searchType === 'room' ? 'active' : ''}`}
                onClick={() => setSearchType('room')}
              >
                Tìm theo số phòng
              </button>
            </div>

            <div className="checkout-search-input-wrapper">
              <div className="checkout-search-icon">
                <img src={SearchIcon} alt="Search" />
              </div>
              <input
                type="text"
                className="checkout-search-input"
                placeholder={searchType === 'booking' ? 'Tìm theo mã đơn, tên khách, SĐT...' : 'Tìm theo số phòng'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="checkout-results">
              {filteredCheckouts.map(reservation => (
                <CheckOutCard
                  key={reservation.reservationId}
                  bookingId={reservation.reservationCode}
                  guestName={reservation.customerName}
                  phone={reservation.phone}
                  checkInDate={reservation.checkInDate}
                  checkOutDate={reservation.checkOutDate}
                  nigh
                  ts={reservation.reservationDetails[0]?.nights || 0}
                  rooms={reservation.reservationDetails}
                  onCheckOutAll={() => handleCheckOutAll(reservation)}
                  onRoomClick={(roomIndex) => handleRoomClick(reservation, roomIndex)}
                />
              ))}
              
              {filteredCheckouts.length === 0 && (
                <div className="checkout-no-results">
                  <p>Không tìm thấy kết quả phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Check-out Modal */}
      <CheckOutModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
          setPreselectedRoomIndices([]);
        }}
        bookingData={selectedBooking}
        preselectedRooms={preselectedRoomIndices}
        onConfirm={handleConfirmCheckOut}
      />

      {/* Invoice Payment Modal */}
      <InvoicePaymentModal
        isOpen={isInvoiceModalOpen}
        onClose={handleCloseInvoiceModal}
        invoice={currentInvoice}
        onPayment={handlePayment}
      />
    </div>
  );
};

export default CheckOutManagement;
