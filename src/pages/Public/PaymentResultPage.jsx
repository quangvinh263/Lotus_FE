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
    const name = qp.get('buyer_name') || qp.get('fullName') || qp.get('customerName') || '';
    const ref = qp.get('reservationId') || qp.get('orderId') || qp.get('transactionId') || qp.get('zptranid') || qp.get('apptransid') || qp.get('reference') || '';
    setGuestName(name);
    setBookingRef(ref);
  }, [location.search]);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/booking');
  };

  return (
    <div>
      <NavBar />
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
