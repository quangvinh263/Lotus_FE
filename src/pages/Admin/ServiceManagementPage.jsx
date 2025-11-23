import React, { useState } from 'react';
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

const ServiceManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Sample service data
  const services = [
    {
      id: 1,
      name: 'Giặt ủi',
      description: 'Dịch vụ giặt ủi quần áo',
      price: '200,000đ',
    },
    {
      id: 2,
      name: 'Ăn sáng',
      description: 'Buffet ăn sáng',
      price: '150,000đ',
    },
    {
      id: 3,
      name: 'Phòng Gym',
      description: 'Dịch vụ sử dụng phòng gym',
      price: '300,000đ',
    },
    {
      id: 4,
      name: 'Bể bơi',
      description: 'Sử dụng bể bơi ngoài trời',
      price: '100,000đ',
    },
    {
      id: 5,
      name: 'Spa',
      description: 'Dịch vụ chăm sóc spa',
      price: '500,000đ',
    },
    {
      id: 6,
      name: 'Karaoke',
      description: 'Phòng karaoke cao cấp',
      price: '200,000đ',
    },
    {
      id: 7,
      name: 'Thuê sân',
      description: 'Thuê xe du lịch 7 chỗ',
      price: '600,000đ',
    },
  ];

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
              <p className="admin-service-stat-value">7</p>
            </div>
            <div className="admin-service-stat-card">
              <p className="admin-service-stat-label">Doanh thu dịch vụ tháng này</p>
              <p className="admin-service-stat-value">45 triệu đồng</p>
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
            {services.map((service) => (
              <div key={service.id} className="admin-service-card">
                <div className="admin-service-card-info">
                  <div className="admin-service-card-text">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className="admin-service-card-price">
                    <p>{service.price}</p>
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
