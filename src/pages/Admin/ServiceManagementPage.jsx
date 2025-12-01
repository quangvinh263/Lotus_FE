import React, { useState, useEffect } from 'react';
import '../../styles/Admin/ServiceManagementPage.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import AddServiceModal from '../../components/Admin/AddServiceModal';
import EditServiceModal from '../../components/Admin/EditServiceModal';
import DeleteServiceModal from '../../components/Admin/DeleteServiceModal';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import PlusIcon from '../../assets/icons/PlusIcon.svg';
import ModifyIcon from '../../assets/icons/ModifyIcon.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';
import { getAllServices } from '../../api/serviceApi';
import { getRevenueByMonth } from '../../api/serviceApi';


const ServiceManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Sample service data
  const [services, setServices] = useState([]);
  const [revenue, setRevenue] = useState(0);



  useEffect(() => {
    const fetchServices = async () => {
      const result = await getAllServices();
      console.log("Fetched services:", result.services);
      if (result.success) {
        const mappedServices = result.services.map((service) => ({
          id: service.serviceId,
          name: service.serviceName,
          description: service.description,
          price: service.price,
        }));
        setServices(mappedServices);
      } else {
        console.error(result.message);
      } 
    };
    fetchServices();

    const fetchRevenue = async () => {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const result = await getRevenueByMonth(month, year);
      console.log("Fetched revenue:", result.revenue);
      console.log("For month/year:", month, year);
      if (result.success) {
        setRevenue(result.revenue);
      } else {
        console.error(result.message);
      }
    };
    fetchRevenue();
  }, []);

  const handleAddService = () => {
    setShowAddModal(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const handleAdd = (newService) => {
    console.log('Adding service:', newService);
    // TODO: Add API call to add service
    setShowAddModal(false);
  };

  const handleEdit = (updatedService) => {
    console.log('Updating service:', updatedService);
    // TODO: Add API call to update service
    setShowEditModal(false);
  };

  const handleDelete = () => {
    console.log('Deleting service:', selectedService);
    // TODO: Add API call to delete service
    setShowDeleteModal(false);
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.price.toString().toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div className="admin-service-management-page">
      <AdminSidebar />
      <div className="admin-service-management-content">
        <AdminHeader />
        <div className="admin-service-management-container">
          <div className="admin-service-management-header">
            <div className="admin-service-management-title">
              <h1>Quản lý dịch vụ</h1>
              <p>Quản lý các dịch vụ của khách sạn</p>
            </div>
            <button className="admin-service-add-btn" onClick={handleAddService}>
              <img src={PlusIcon} alt="Add" />
              <span>Thêm dịch vụ</span>
            </button>
          </div>

          <div className="admin-service-stats">
            <div className="admin-service-stat-card">
              <p className="admin-service-stat-label">Tổng dịch vụ </p>
              <p className="admin-service-stat-value">{services.length}</p>
            </div>
            <div className="admin-service-stat-card">
              <p className="admin-service-stat-label">Doanh thu dịch vụ tháng này</p>
              <p className="admin-service-stat-value">{revenue} triệu đồng</p>
            </div>
          </div>

          <div className="admin-service-search-container">
            <div className="admin-service-search-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-service-search-input"
              />
              <img
                src={SearchIcon}
                alt="Search"
                className="admin-service-search-icon"
              />
            </div>
          </div>

          <div className="admin-service-grid">
            {filteredServices.map((service, index) => (
              <div key={service.id || index} className="admin-service-card">
                <div className="admin-service-card-info">
                  <div className="admin-service-card-text">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className="admin-service-card-price">
                    <p>{service.price} đồng</p>
                  </div>
                </div>
                <div className="admin-service-card-actions">
                  <button
                    className="admin-service-edit-btn"
                    onClick={() => handleEditService(service)}
                  >
                    <img src={ModifyIcon} alt="Edit" />
                    <span>Sửa</span>
                  </button>
                  <button
                    className="admin-service-delete-btn"
                    onClick={() => handleDeleteService(service)}
                  >
                    <img src={DeleteIcon} alt="Delete" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddServiceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />

      <EditServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEdit}
        service={selectedService}
      />

      <DeleteServiceModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        service={selectedService}
      />
    </div>
  );
};

export default ServiceManagementPage;
