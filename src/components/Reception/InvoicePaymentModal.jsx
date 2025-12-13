import React, { useState } from 'react';
import './InvoicePaymentModal.css';

const InvoicePaymentModal = ({ isOpen, onClose, invoice, onPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'zalopay'
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !invoice) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await onPayment(invoice.invoiceId, paymentMethod);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="invoice-payment-overlay">
      <div className="invoice-payment-modal">
        <div className="invoice-payment-header">
          <h2>Hóa Đơn Thanh Toán</h2>
          <button className="invoice-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="invoice-payment-content">
          {/* Invoice Information */}
          <div className="invoice-info-section">
            <div className="invoice-id-row">
              <span className="invoice-label">Mã hóa đơn:</span>
              <span className="invoice-value invoice-id">{invoice.invoiceId}</span>
            </div>
            <div className="invoice-date-row">
              <span className="invoice-label">Ngày tạo:</span>
              <span className="invoice-value">{formatDate(invoice.invoiceDate)}</span>
            </div>
            <div className="invoice-reservation-row">
              <span className="invoice-label">Mã đặt phòng:</span>
              <span className="invoice-value">{invoice.reservationId}</span>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="invoice-breakdown-section">
            <h3>Chi tiết thanh toán</h3>
            <div className="invoice-breakdown-list">
              <div className="invoice-breakdown-item">
                <span>Tiền phòng</span>
                <span className="invoice-amount">{formatCurrency(invoice.roomSubtotal)}</span>
              </div>
              <div className="invoice-breakdown-item">
                <span>Tiền dịch vụ</span>
                <span className="invoice-amount">{formatCurrency(invoice.serviceSubtotal)}</span>
              </div>
              <div className="invoice-breakdown-divider"></div>
              <div className="invoice-breakdown-item invoice-total">
                <span>Tổng cộng</span>
                <span className="invoice-amount-total">{formatCurrency(invoice.totalAmount)}</span>
              </div>
              {invoice.amountPaid > 0 && (
                <>
                  <div className="invoice-breakdown-item">
                    <span>Đã thanh toán</span>
                    <span className="invoice-amount invoice-paid">-{formatCurrency(invoice.amountPaid)}</span>
                  </div>
                  <div className="invoice-breakdown-divider"></div>
                </>
              )}
              <div className="invoice-breakdown-item invoice-due">
                <span>Còn phải trả</span>
                <span className="invoice-amount-due">{formatCurrency(invoice.amountDue)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          {invoice.amountDue > 0 && (
            <div className="payment-method-section">
              <h3>Phương thức thanh toán</h3>
              <div className="payment-methods">
                <button
                  className={`payment-method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <div className="payment-method-icon">💵</div>
                  <div className="payment-method-name">Tiền mặt</div>
                </button>
                <button
                  className={`payment-method-btn ${paymentMethod === 'zalopay' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('zalopay')}
                >
                  <div className="payment-method-icon">📱</div>
                  <div className="payment-method-name">ZaloPay</div>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="invoice-payment-actions">
            {invoice.amountDue > 0 ? (
              <>
                <button 
                  className="invoice-print-btn"
                  onClick={() => window.print()}
                >
                  In hóa đơn
                </button>
                <button 
                  className="invoice-pay-btn"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Đang xử lý...' : `Thanh toán ${formatCurrency(invoice.amountDue)}`}
                </button>
              </>
            ) : (
              <>
                <button 
                  className="invoice-print-btn"
                  onClick={() => window.print()}
                >
                  In hóa đơn
                </button>
                <button 
                  className="invoice-done-btn"
                  onClick={onClose}
                >
                  Hoàn tất
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePaymentModal;
