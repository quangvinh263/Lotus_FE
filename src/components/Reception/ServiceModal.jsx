import { useState, useEffect } from 'react';
import ArrowIcon from '../../assets/icons/ArrowIcon.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import { getAllServices, getServicesByReservationDetail, addServiceOrder, deleteServiceOrder } from '../../api/serviceApi';
import './ServiceModal.css';

function ServiceModal({ room, onClose, onSave }) {
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [services, setServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load available services and used services on mount
  useEffect(() => {
    if (room?.reservationDetailId) {
      loadData();
    }
  }, [room?.reservationDetailId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load available services
      const servicesResult = await getAllServices();
      if (servicesResult.success) {
        console.log('📥 Available services:', servicesResult.services);
        setAvailableServices(servicesResult.services.map(s => ({
          id: s.serviceId,
          name: s.serviceName,
          price: s.price
        })));
      }

      // Load used services for this room
      const usedServicesResult = await getServicesByReservationDetail(room.reservationDetailId);
      if (usedServicesResult.success) {
        console.log('📥 Used services:', usedServicesResult.services);
        setServices(usedServicesResult.services.map(s => ({
          serviceOrderId: s.serviceOrderId,
          name: s.serviceName,
          price: s.price,
          quantity: s.quantity
        })));
      }
    } catch (error) {
      console.error('❌ Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const handleAddService = async () => {
    if (!selectedService) return;

    const service = availableServices.find(s => s.id === selectedService);
    if (!service) return;

    setLoading(true);
    try {
      // Call API to add service order
      const result = await addServiceOrder(room.reservationDetailId, service.id, quantity);
      
      if (result.success) {
        console.log('✅ Service added successfully');
        // Reload services list
        await loadData();
        alert('Thêm dịch vụ thành công!');
      } else {
        console.error('❌ Failed to add service:', result.message);
        alert(result.message || 'Không thể thêm dịch vụ');
      }
    } catch (error) {
      console.error('❌ Error adding service:', error);
      alert('Có lỗi xảy ra khi thêm dịch vụ');
    } finally {
      setLoading(false);
    }

    // Reset form
    setSelectedService('');
    setQuantity(1);
  };

  const handleRemoveService = async (service) => {
    if (!service.serviceOrderId) {
      alert('Không thể xóa dịch vụ này');
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa dịch vụ "${service.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteServiceOrder(service.serviceOrderId);
      
      if (result.success) {
        console.log('✅ Service deleted successfully');
        // Reload services list
        await loadData();
        alert('Xóa dịch vụ thành công!');
      } else {
        console.error('❌ Failed to delete service:', result.message);
        alert(result.message || 'Không thể xóa dịch vụ');
      }
    } catch (error) {
      console.error('❌ Error deleting service:', error);
      alert('Có lỗi xảy ra khi xóa dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return services.reduce((total, service) => {
      const qty = service.quantity || 1;
      return total + (service.price * qty);
    }, 0);
  };

  const handleSave = () => {
    // Services are saved immediately when added/removed, just close modal
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

            <button className="sm-add-btn" onClick={handleAddService} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.33 8H12.67M8 3.33V12.67" stroke="white" strokeWidth="1.33" strokeLinecap="round"/>
              </svg>
              {loading ? 'Đang xử lý...' : 'Thêm dịch vụ'}
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
                                onClick={() => handleRemoveService(service)}
                                disabled={loading}
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
