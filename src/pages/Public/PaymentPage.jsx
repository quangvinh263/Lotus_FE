import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import BookingConfirmationPopup from '../../components/BookingConfirmationPopup';
import '../../styles/PaymentPage.css';

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { guestInfo, ...bookingData } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const generateBookingReference = () => {
    const timestamp = Date.now().toString().slice(-8);
    return `LOTUS${timestamp}`;
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({});
  };

  const handleCardChange = (e) => {
    let { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateCard = () => {
    const newErrors = {};

    if (!cardData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!cardData.cardHolder.trim()) {
      newErrors.cardHolder = 'Cardholder name is required';
    }

    if (!cardData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    }

    if (!cardData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (cardData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'credit-card' && !validateCard()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      const reference = generateBookingReference();
      setBookingReference(reference);
      setShowPopup(true);
    }, 2000);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/booking');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="payment-page">
      <NavBar />
      
      <div className="payment-container">
        <div className="payment-header">
          <button className="back-button" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#133E87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1>Payment</h1>
        </div>

        <div className="payment-content">
          <div className="payment-form-section">
            <form onSubmit={handleSubmit}>
              <div className="payment-method-card">
                <h2>Payment Method</h2>
                
                <div className="payment-methods">
                  <div 
                    className={`payment-method-option ${paymentMethod === 'credit-card' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodChange('credit-card')}
                  >
                    <input
                      type="radio"
                      id="credit-card"
                      name="paymentMethod"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={() => handlePaymentMethodChange('credit-card')}
                    />
                    <label htmlFor="credit-card">Credit/Debit Card</label>
                  </div>

                  <div 
                    className={`payment-method-option ${paymentMethod === 'vnpay' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodChange('vnpay')}
                  >
                    <input
                      type="radio"
                      id="vnpay"
                      name="paymentMethod"
                      value="vnpay"
                      checked={paymentMethod === 'vnpay'}
                      onChange={() => handlePaymentMethodChange('vnpay')}
                    />
                    <label htmlFor="vnpay">VNPay</label>
                  </div>
                </div>

                {paymentMethod === 'credit-card' && (
                  <div className="card-details">
                    <div className="payment-form-group">
                      <label htmlFor="cardNumber">Card Number *</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        className={errors.cardNumber ? 'error' : ''}
                      />
                      {errors.cardNumber && <span className="payment-error-message">{errors.cardNumber}</span>}
                    </div>

                    <div className="payment-form-group">
                      <label htmlFor="cardHolder">Cardholder Name *</label>
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        value={cardData.cardHolder}
                        onChange={handleCardChange}
                        placeholder="John Doe"
                        className={errors.cardHolder ? 'error' : ''}
                      />
                      {errors.cardHolder && <span className="payment-error-message">{errors.cardHolder}</span>}
                    </div>

                    <div className="payment-form-row">
                      <div className="payment-form-group">
                        <label htmlFor="expiryDate">Expiry Date *</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          className={errors.expiryDate ? 'error' : ''}
                        />
                        {errors.expiryDate && <span className="payment-error-message">{errors.expiryDate}</span>}
                      </div>

                      <div className="payment-form-group">
                        <label htmlFor="cvv">CVV *</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          className={errors.cvv ? 'error' : ''}
                        />
                        {errors.cvv && <span className="payment-error-message">{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'vnpay' && (
                  <div className="payment-info">
                    <h3 style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      fontSize: '20px', 
                      fontWeight: 700, 
                      color: '#133E87',
                      marginTop: 0,
                      marginBottom: '12px'
                    }}>
                      VNPay Payment
                    </h3>
                    <p style={{ marginBottom: '12px' }}>
                      You will be redirected to VNPay payment gateway to complete your transaction securely.
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                      VNPay supports multiple payment methods:
                    </p>
                    <ul style={{ 
                      marginTop: 0, 
                      marginBottom: '12px',
                      paddingLeft: '20px',
                      fontFamily: "'Garamond', serif"
                    }}>
                      <li>ATM Cards / Internet Banking</li>
                      <li>International Cards (Visa, MasterCard, JCB)</li>
                      <li>QR Code Payment</li>
                      <li>E-Wallets (Momo, ZaloPay, ViettelPay)</li>
                    </ul>
                    <p style={{ marginBottom: 0 }}>
                      After completing the payment, you will be redirected back to our website with your booking confirmation.
                    </p>
                  </div>
                )}
              </div>

              <div className="payment-form-actions">
                <button type="button" className="payment-btn-back" onClick={handleBack}>
                  Back
                </button>
                <button type="submit" className="payment-btn-pay" disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Complete Payment'}
                </button>
              </div>
            </form>
          </div>

          <div className="payment-summary-section">
            <div className="summary-card">
              <h2>Booking Summary</h2>
              
              <div className="summary-section">
                <h3>Room Details</h3>
                <div className="summary-item">
                  <span className="label">Room Type:</span>
                  <span className="value">{bookingData.roomType || 'Superior Room'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Check-in:</span>
                  <span className="value">{bookingData.checkIn || 'Sat, 18 Oct 2025'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Check-out:</span>
                  <span className="value">{bookingData.checkOut || 'Sun, 19 Oct 2025'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Guests:</span>
                  <span className="value">{bookingData.guests || '2 adults'}</span>
                </div>
              </div>

              {guestInfo && (
                <div className="summary-section">
                  <h3>Guest Information</h3>
                  <div className="summary-item">
                    <span className="label">Name:</span>
                    <span className="value">{guestInfo.fullName}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Email:</span>
                    <span className="value">{guestInfo.email}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Phone:</span>
                    <span className="value">{guestInfo.phone}</span>
                  </div>
                </div>
              )}

              <div className="summary-section total-section">
                <div className="summary-item total">
                  <span className="label">Total Amount:</span>
                  <span className="value">{bookingData.total || 'VND 5,000,000'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Popup */}
      <BookingConfirmationPopup 
        isOpen={showPopup}
        onClose={handlePopupClose}
        guestName={guestInfo?.fullName}
        bookingReference={bookingReference}
      />
    </div>
  );
}

export default PaymentPage;
