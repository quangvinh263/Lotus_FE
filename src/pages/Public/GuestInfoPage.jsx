import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../../components//Public/NavBar';
import '../../styles/GuestInfoPage.css';
import { AuthContext } from '../../context/AuthContext';
import { getPersonalInfo, createCustomer, findCustomerByPhone, deleteCustomer } from '../../api/customerApi';
import { createOnlineBooking } from '../../api/bookingApi';
import { processDepositZaloPayPayment } from '../../api/paymentApi';
import { toast } from 'react-toastify';

function GuestInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {};

  // Build a friendly room summary string (handles multiple rooms)
  const roomSummary = (() => {
    const rooms = bookingData.rooms;
    if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
      return bookingData.roomType || 'Superior Room';
    }

    // Count by room name (selectedRoomsData contains multiple entries per quantity)
    const counts = {};
    rooms.forEach(r => {
      const name = r?.name || r?.roomType || 'Room';
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, cnt]) => (cnt > 1 ? `${name} x${cnt}` : name))
      .join(', ');
  })();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    address: ''
  });

  const { auth } = useContext(AuthContext);

  // Normalize gender values from various formats to 'male'|'female'|'other'
  const normalizeGender = (g) => {
    if (!g) return '';
    const s = String(g).trim().toLowerCase();
    if (s === 'male' || s === 'm' || s === 'nam' || s === '1' || s === 'true') return 'male';
    if (s === 'female' || s === 'f' || s === 'nu' || s === 'nữ' || s === '0' || s === 'false') return 'female';
    if (s === 'other' || s === 'o' || s === 'khac' || s === 'khác') return 'other';
    return '';
  };

  // If user is logged in, try to fetch their personal info and prefill the form
  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        if (bookingData?.guestInfo) {
          // If bookingData already contains guestInfo (from previous step), use it (normalize gender)
          const incoming = { ...bookingData.guestInfo };
          if (incoming.gender) incoming.gender = normalizeGender(incoming.gender);
          setFormData(prev => ({ ...prev, ...incoming }));
          return;
        }

        const accountId = auth?.accountId;
        if (!accountId) return;

        const res = await getPersonalInfo(accountId);
        if (res.success && res.data) {
          const customer = res.data;
          setFormData(prev => ({
            ...prev,
            fullName: customer.fullName || customer.name || prev.fullName,
            email: customer.email || prev.email,
            phone: customer.phone || customer.phone || prev.phone,
            gender: normalizeGender(customer.gender) || prev.gender,
            address: customer.address || prev.address
          }));
        }
      } catch (err) {
        // ignore
      }
    };

    loadPersonalInfo();
  }, [auth, bookingData]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Email is optional, but if provided, must be valid
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s+-]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    // Require gender and address
    if (!formData.gender || !['male', 'female', 'other'].includes(formData.gender)) {
      newErrors.gender = 'Please select a gender';
    }

    if (!formData.address || !formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // Step 1: Find or create customer
      let customerId = null;
      let isNewCustomer = false; // Track if we created a new customer

      // Try to find existing customer by phone
      const findRes = await findCustomerByPhone(formData.phone);
      if (findRes.success && findRes.customerId) {
        customerId = findRes.customerId;
        console.log('✅ Found existing customer:', customerId);
      } else {
        // Create new customer
        const customerData = {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          gender: formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : 'Other',
          dateOfBirth: null // Optional, can be added to form later
        };

        const createRes = await createCustomer(customerData);
        if (!createRes.success) {
          toast.error(createRes.message || 'Failed to create customer');
          setIsProcessing(false);
          return;
        }

        customerId = createRes.customerId;
        isNewCustomer = true; // Mark that we created this customer
        console.log('✅ Created new customer:', customerId);
      }

      if (!customerId) {
        toast.error('Failed to get customer ID');
        setIsProcessing(false);
        return;
      }

      // Step 2: Create booking with customerId
      const payload = {
      customerId: customerId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      rooms: (bookingData.selectedRooms || bookingData.rooms || []).map(room => ({
        roomTypeId: room.roomTypeId || room.id,
        numberOfRooms: room.numberOfRooms || room.quantity || 1,
        guestsPerRoom: room.guestsPerRoom || room.capacity || 2
      }))
    };

    console.log('📦 Booking payload:', payload);

      console.log('📤 Creating booking, isNewCustomer:', isNewCustomer, 'customerId:', customerId);
      const res = await createOnlineBooking(payload);
      console.log('📥 Booking response:', res);
      
      if (!res.success) {
        // ⚠️ ROLLBACK: If we created a new customer but booking failed, delete the customer
        if (isNewCustomer && customerId) {
          console.warn('⚠️ Booking failed, rolling back new customer:', customerId);
          const rollbackResult = await deleteCustomer(customerId);
          console.log('🔄 Rollback result:', rollbackResult);
          if (rollbackResult.success) {
            console.log('✅ Rollback successful: Customer deleted');
          } else {
            console.error('❌ Rollback failed:', rollbackResult.message);
          }
        } else {
          console.log('ℹ️ No rollback needed. isNewCustomer:', isNewCustomer, 'customerId:', customerId);
        }
        
        toast.error(res.message || 'Failed to create booking');
        setIsProcessing(false);
        return;
      }

      // Extract reservation ID from response
      const respData = res.data || {};
    const reservationId = 
      respData.newReservation?.reservationId ||  // ✅ Đúng vị trí theo response
      respData.reservationId || 
      respData.reservation?.id || 
      respData.id;

    console.log('🔍 Extracted reservationId:', reservationId);

      if (!reservationId) {
        // ⚠️ ROLLBACK: Delete customer if we created one
        if (isNewCustomer && customerId) {
          console.warn('⚠️ Reservation ID not found, rolling back new customer:', customerId);
          await deleteCustomer(customerId);
        }
        
        toast.error('Booking created but reservation ID not found');
        setIsProcessing(false);
        return;
      }

      // Calculate deposit amount (30% of total)
      const depositAmount = depositNumeric;

      // Call ZaloPay deposit payment API
      const payRes = await processDepositZaloPayPayment(reservationId, depositAmount);
      if (!payRes.success) {
        // ⚠️ ROLLBACK: Delete customer if we created one
        if (isNewCustomer && customerId) {
          console.warn('⚠️ Payment failed, rolling back new customer:', customerId);
          await deleteCustomer(customerId);
        }
        
        toast.error(payRes.message || 'Failed to create ZaloPay deposit link');
        setIsProcessing(false);
        return;
      }

      // Redirect to ZaloPay payment URL
      const paymentUrl = payRes.paymentUrl || payRes.data?.paymentUrl;
      if (paymentUrl) {
        console.log('✅ Redirecting to ZaloPay:', paymentUrl);
        // Save guest name for payment result page
        localStorage.setItem('paymentGuestName', formData.fullName);
        window.location.href = paymentUrl;
        return;
      }

      // ⚠️ ROLLBACK: Delete customer if we created one
      if (isNewCustomer && customerId) {
        console.warn('⚠️ Payment URL not found, rolling back new customer:', customerId);
        await deleteCustomer(customerId);
      }
      
      toast.error('Payment URL not found in response');
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while creating booking/payment');
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Compute numeric total and deposit (30%) for display
  const parseNumber = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    try {
      // Remove all except digits, dash, dot, comma
      let s = String(val).replace(/[^\d.,-]/g, '');
      // Remove thousand separators (dots and commas not at the end)
      // Keep only the last dot or comma as decimal point
      s = s.replace(/[.,](?=\d{3})/g, ''); // Remove dots/commas followed by exactly 3 digits (thousand sep)
      s = s.replace(/,/g, '.'); // Convert remaining comma to dot (decimal point)
      const n = Number(s);
      return Number.isFinite(n) ? n : 0;
    } catch (e) {
      return 0;
    }
  };

  const totalNumeric = parseNumber(bookingData.total);
  const totalFromRooms = (() => {
    const rooms = bookingData.rooms || [];
    const nights = bookingData.nights || 1;
    let sum = 0;
    rooms.forEach(r => {
      const price = parseNumber(r?.rawPrice ?? r?.price ?? r?.unitPrice ?? r?.unitRaw);
      if (price && Number.isFinite(price)) {
        sum += price * nights;
      }
    });
    return sum;
  })();

  const finalTotal = totalNumeric > 0 ? totalNumeric : (totalFromRooms > 0 ? totalFromRooms : 0);
  const depositNumeric = Math.round(finalTotal * 0.3);
  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="guest-info-page">
      <NavBar />
      
      <div className="guest-info-container">
        <div className="guest-info-header">
          <button className="guest-info-back-button" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#133E87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1>Guest Information</h1>
        </div>

        <div className="guest-info-content-wrapper">
        
          <form className="guest-info-form" onSubmit={handleSubmit}>
            <div className="guest-form-card">
              <h2>Personal Details</h2>

              <div className="guest-form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="guest-error-message">{errors.fullName}</span>}
              </div>

              <div className="guest-form-row">
                <div className="guest-form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="guest-error-message">{errors.email}</span>}
                </div>

                <div className="guest-form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+84 123 456 789"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="guest-error-message">{errors.phone}</span>}
                </div>
              </div>

              <div className="guest-form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? 'error' : ''}
                >
                  <option value="">-- Select gender --</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className="guest-error-message">{errors.gender}</span>}
              </div>

              <div className="guest-form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="guest-error-message">{errors.address}</span>}
              </div>
            </div>

            <div className="guest-form-actions">
              <button type="button" className="guest-btn-back" onClick={handleBack}>
                Back
              </button>
              <button type="submit" className="guest-btn-continue" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </form>
          <div className="guest-booking-summary-card">
            <h2>Booking Summary</h2>
            <div className="guest-summary-details">
              <div className="guest-summary-item">
                <span className="label">Check-in</span>
                <span className="value">{bookingData.checkIn || 'Sat, 18 Oct 2025'}</span>
              </div>
              <div className="guest-summary-item">
                <span className="label">Check-out</span>
                <span className="value">{bookingData.checkOut || 'Sun, 19 Oct 2025'}</span>
              </div>
              <div className="guest-summary-item">
                <span className="label">Guests</span>
                <span className="value">{bookingData.guests || '2 adults'}</span>
              </div>

              {/* Room list grouped by name with quantity, nights and subtotal */}
              <div style={{ marginTop: 12, marginBottom: 8, fontWeight: 700, color: '#133E87' }}>Rooms</div>
              {(() => {
                const rooms = bookingData.rooms || [];
                if (rooms.length === 0) {
                  return (
                    <div className="guest-summary-item">
                      <span className="label">Room</span>
                      <span className="value">{bookingData.roomType || 'Superior Room'}</span>
                    </div>
                  );
                }

                // group by room name
                const groups = {};
                rooms.forEach(r => {
                  const name = r?.name || r?.roomType || 'Room';
                  if (!groups[name]) {
                    groups[name] = { name, qty: 0, unitRaw: r?.rawPrice ?? null, unitFormatted: r?.price ?? '' };
                  }
                  groups[name].qty += 1;
                });

                const nights = bookingData.nights || 1;

                return Object.values(groups).map(g => {
                  const subtotal = (g.unitRaw || 0) * nights * g.qty;
                  const subtotalFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal);
                  const unitPriceFormatted = g.unitFormatted || (g.unitRaw ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(g.unitRaw) : '');
                  return (
                    <div key={g.name} className="guest-summary-item" style={{ alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="label" style={{ fontWeight: 700 }}>{g.name}{g.qty > 1 ? ` x${g.qty}` : ''}</span>
                        <span style={{ fontSize: 13, color: '#608BC1' }}>{nights} night{nights > 1 ? 's' : ''} • {unitPriceFormatted} / night</span>
                      </div>
                      <span className="value">{subtotalFormatted}</span>
                    </div>
                  );
                });
              })()}

              <div style={{ height: 8 }}></div>
              <div className="guest-summary-item">
                <span className="label">Total</span>
                <span className="value">{finalTotal > 0 ? formatVND(finalTotal) : (bookingData.total || 'VND 5,000,000')}</span>
              </div>
              <div className="guest-summary-item">
                <span className="label">Deposit (30%)</span>
                <span className="value">{finalTotal > 0 ? formatVND(depositNumeric) : (bookingData.total ? bookingData.total : 'VND 5,000,000')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestInfoPage;
