import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../../components//Public/NavBar';
import BookingConfirmationPopup from '../../components/Public/BookingConfirmationPopup';

function PaymentResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    // Parse query params Zalopay may send back (adjust names if your backend uses others)
    const qp = new URLSearchParams(location.search);
    
    // Try to get guest name from localStorage first, then query params
    const savedName = localStorage.getItem('paymentGuestName');
    const name = savedName || qp.get('buyer_name') || qp.get('fullName') || qp.get('customerName') || '';
    
    // Get booking reference - prioritize reservationId
    const ref = qp.get('reservationId') || qp.get('orderId') || qp.get('transactionId') || qp.get('zptranid') || qp.get('apptransid') || qp.get('reference') || '';
    
    setGuestName(name);
    setBookingRef(ref);
    
    // Clear saved guest name after using it
    if (savedName) {
      localStorage.removeItem('paymentGuestName');
    }
  }, [location.search]);

  const handleClose = () => {
    setIsOpen(false);
    // Check if there's a saved return path (from checkout or other sources)
    const returnPath = localStorage.getItem('paymentReturnPath');
    if (returnPath) {
      localStorage.removeItem('paymentReturnPath');
      navigate(returnPath);
    } else {
      navigate('/booking');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <BookingConfirmationPopup
        isOpen={isOpen}
        onClose={handleClose}
        guestName={guestName}
        bookingReference={bookingRef}
      />
    </div>
  );
}

export default PaymentResultPage;
