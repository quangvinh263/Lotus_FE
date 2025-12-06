import React from 'react';
import '../../styles/Admin/PaymentFilterPopup.css';

const PaymentFilterPopup = ({ isOpen, onClose, onApply, buttonRef }) => {
  const [selectedPaymentStatus, setSelectedPaymentStatus] = React.useState('all');

  const paymentStatuses = [
    { value: 'all', label: 'Tất cả' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'deposited', label: 'Đã đặt cọc' },
    { value: 'unpaid', label: 'Chưa thanh toán / Chưa đặt cọc' }
  ];

  const handleApply = () => {
    onApply(selectedPaymentStatus);
    onClose();
  };

  const handleReset = () => {
    setSelectedPaymentStatus('all');
    onApply('all');
    onClose();
  };

  if (!isOpen) return null;

  // Tính toán vị trí popup dựa trên button
  const getPopupStyle = () => {
    if (buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popupHeight = 280; // Chiều cao ước tính của popup
      const spaceBelow = window.innerHeight - rect.bottom;
      
      // Nếu không đủ chỗ bên dưới, hiển thị bên trên
      const showAbove = spaceBelow < popupHeight + 16;
      
      return {
        top: showAbove ? `${rect.top - popupHeight - 8}px` : `${rect.bottom + 8}px`,
        right: `${window.innerWidth - rect.right}px`
      };
    }
    return {};
  };

  return (
    <>
      <div className="payment-filter-overlay" onClick={onClose} />
      <div 
        className="payment-filter-popup" 
        style={getPopupStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="payment-filter-header">
          <h3>Lọc theo thanh toán</h3>
          <button className="payment-filter-close" onClick={onClose}>×</button>
        </div>
        
        <div className="payment-filter-content">
          <div className="payment-filter-group">
            {paymentStatuses.map((status) => (
              <label key={status.value} className="payment-filter-radio">
                <input
                  type="radio"
                  name="paymentStatus"
                  value={status.value}
                  checked={selectedPaymentStatus === status.value}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                />
                <span>{status.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="payment-filter-footer">
          <button className="payment-filter-reset-btn" onClick={handleReset}>
            Đặt lại
          </button>
          <button className="payment-filter-apply-btn" onClick={handleApply}>
            Áp dụng
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentFilterPopup;
