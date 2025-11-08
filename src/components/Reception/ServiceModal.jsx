import { useState } from 'react';
import ArrowIcon from '../../assets/icons/ArrowIcon.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import './ServiceModal.css';

function ServiceModal({ room, onClose, onSave }) {
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [services, setServices] = useState(room?.services || []);

  // Available services list
  const availableServices = [
    { id: 'laundry', name: 'Giặt ủi', price: 50000 },
    { id: 'minibar', name: 'Minibar', price: 100000 },
    { id: 'room_breakfast', name: 'Ăn sáng phòng', price: 250000 },
    { id: 'room_dinner', name: 'Ăn tối phòng', price: 400000 },
    { id: 'massage_relax', name: 'Massage thư giãn', price: 500000 },
    { id: 'massage_full', name: 'Massage toàn thân', price: 700000 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const handleAddService = () => {
    if (!selectedService) return;

    const service = availableServices.find(s => s.id === selectedService);
    if (!service) return;

    const existingService = services.find(s => s.name === service.name);
    
    if (existingService) {
      // Update quantity if service already exists
      setServices(services.map(s => 
        s.name === service.name 
          ? { ...s, quantity: s.quantity + quantity }
          : s
      ));
    } else {
      // Add new service
      setServices([...services, { 
        name: service.name, 
        price: service.price, 
        quantity: quantity 
      }]);
    }

    // Reset form
    setSelectedService('');
    setQuantity(1);
  };

  const handleRemoveService = (serviceName) => {
    setServices(services.filter(s => s.name !== serviceName));
  };

  const getTotalAmount = () => {
    return services.reduce((total, service) => {
      const qty = service.quantity || 1;
      return total + (service.price * qty);
    }, 0);
  };

  const handleSave = () => {
    onSave(room.id, services);
    onClose();
  };

  if (!room) return null;

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sm-close-btn" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="#133E87" strokeWidth="1.33" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header */}
        <div className="sm-header">
          <h2 className="sm-title">Quản lý dịch vụ - Phòng {room.id}</h2>
          <p className="sm-subtitle">Khách: {room.customerName} • {room.roomType}</p>
        </div>

        {/* Content */}
        <div className="sm-content">
          {/* Add Service Section */}
          <div className="sm-add-section">
            <h3 className="sm-section-title">Thêm dịch vụ mới</h3>
            
            <div className="sm-form">
              <div className="sm-form-group">
                <label className="sm-label">Chọn dịch vụ</label>
                <div className="sm-select-wrapper">
                  <select 
                    className="sm-select"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">Chọn dịch vụ</option>
                    {availableServices.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {formatCurrency(service.price)}
                      </option>
                    ))}
                  </select>
                  <img src={ArrowIcon} alt="Arrow" className="sm-select-arrow" />
                </div>
              </div>

              <div className="sm-form-group">
                <label className="sm-label">Số lượng</label>
                <input
                  type="number"
                  className="sm-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
              </div>
            </div>

            <button className="sm-add-btn" onClick={handleAddService}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.33 8H12.67M8 3.33V12.67" stroke="white" strokeWidth="1.33" strokeLinecap="round"/>
              </svg>
              Thêm dịch vụ
            </button>
          </div>

          {/* Used Services Section */}
          <div className="sm-services-section">
            <h3 className="sm-section-title">Dịch vụ đã sử dụng</h3>
            
            <div className="sm-table-wrapper">
              <table className="sm-table">
                <thead className="sm-thead">
                  <tr className="sm-tr">
                    <th className="sm-th sm-th-name">Tên dịch vụ</th>
                    <th className="sm-th sm-th-price">Đơn giá</th>
                    <th className="sm-th sm-th-qty">Số lượng</th>
                    <th className="sm-th sm-th-total">Thành tiền</th>
                    <th className="sm-th sm-th-action">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="sm-tbody">
                  {services.length === 0 ? (
                    <tr className="sm-tr">
                      <td colSpan="5" className="sm-td-empty">
                        Chưa có dịch vụ nào
                      </td>
                    </tr>
                  ) : (
                    <>
                      {services.map((service, index) => {
                        const qty = service.quantity || 1;
                        return (
                          <tr key={index} className="sm-tr">
                            <td className="sm-td sm-td-name">{service.name}</td>
                            <td className="sm-td sm-td-price">{formatCurrency(service.price)}</td>
                            <td className="sm-td sm-td-qty">
                              <span className="sm-qty-badge">x{qty}</span>
                            </td>
                            <td className="sm-td sm-td-total">{formatCurrency(service.price * qty)}</td>
                            <td className="sm-td sm-td-action">
                              <button 
                                className="sm-delete-btn"
                                onClick={() => handleRemoveService(service.name)}
                              >
                                <img src={DeleteIcon} alt="Delete" className="sm-delete-icon" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="sm-tr sm-tr-total">
                        <td className="sm-td sm-td-total-label" colSpan="3">Tổng cộng</td>
                        <td className="sm-td sm-td-total-amount" colSpan="2">
                          {formatCurrency(getTotalAmount())}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sm-actions">
          <button className="sm-btn sm-btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="sm-btn sm-btn-save" onClick={handleSave}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceModal;
