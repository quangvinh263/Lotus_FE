import React, { useState } from 'react';
import '../../styles/Admin/EmployeeManagementPage.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import AddEmployeeModal from '../../components/Admin/AddEmployeeModal';
import EditEmployeeModal from '../../components/Admin/EditEmployeeModal';
import DeleteEmployeeModal from '../../components/Admin/DeleteEmployeeModal';
import PlusIcon from '../../assets/icons/PlusIcon.svg';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import MailIcon from '../../assets/icons/MailIcon.svg';
import PhoneIcon from '../../assets/icons/PhoneIcon.svg';
import ModifyIcon from '../../assets/icons/ModifyIcon.svg';
import DeleteIcon from '../../assets/icons/DeleteIcon.svg';

const EmployeeManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeList, setEmployeeList] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      position: 'Lễ tân',
      email: 'nvana@hotel.com',
      phone: '0901234567',
      joinDate: '01/01/2024',
      status: 'active'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      position: 'Lễ tân',
      email: 'tthib@hotel.com',
      phone: '0902234567',
      joinDate: '15/02/2024',
      status: 'active'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      position: 'Lễ tân',
      email: 'lvanc@hotel.com',
      phone: '0903234567',
      joinDate: '10/03/2024',
      status: 'active'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      position: 'Lễ tân',
      email: 'pthid@hotel.com',
      phone: '0904234567',
      joinDate: '20/04/2024',
      status: 'inactive'
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      position: 'Lễ tân',
      email: 'hvane@hotel.com',
      phone: '0905234567',
      joinDate: '05/05/2024',
      status: 'active'
    }
  ]);

  const handleAddEmployee = (formData) => {
    const newEmployee = {
      id: employeeList.length + 1,
      name: formData.fullName,
      position: formData.position,
      email: formData.email,
      phone: formData.phone,
      joinDate: new Date().toLocaleDateString('vi-VN'),
      status: 'active',
      username: formData.username
    };
    setEmployeeList([...employeeList, newEmployee]);
    setShowAddModal(false);
  };

  const handleEditEmployee = (id, formData) => {
    setEmployeeList(employeeList.map(emp => 
      emp.id === id ? {
        ...emp,
        name: formData.fullName,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        username: formData.username
      } : emp
    ));
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (id) => {
    setEmployeeList(employeeList.filter(emp => emp.id !== id));
    setShowDeleteModal(false);
    setSelectedEmployee(null);
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const stats = [
    {
      label: 'Tổng nhân viên',
      value: '45',
      color: '#133E87'
    },
    {
      label: 'Đang làm việc',
      value: '42',
      color: '#00A63E'
    },
    {
      label: 'Tuyển mới tháng này',
      value: '5',
      color: '#133E87'
    }
  ];

  return (
    <div className="admin-employee-page">
      <AdminSidebar />
      <div className="admin-employee-container">
        <AdminHeader />
        <div className="admin-employee-main">
          {/* Header */}
          <div className="admin-employee-header">
            <div className="admin-employee-header-text">
              <h1 className="admin-employee-title">Quản lý nhân viên</h1>
              <p className="admin-employee-subtitle">Quản lý thông tin của nhân viên</p>
            </div>
            <button className="admin-employee-add-btn" onClick={() => setShowAddModal(true)}>
              <img src={PlusIcon} alt="Add" className="admin-employee-add-icon" />
              <span>Thêm nhân viên</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="admin-employee-stats">
            {stats.map((stat, index) => (
              <div key={index} className="admin-employee-stat-card">
                <p className="admin-employee-stat-label">{stat.label}</p>
                <h2 className="admin-employee-stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </h2>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="admin-employee-search-container">
            <div className="admin-employee-search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-employee-search-input"
              />
            </div>
            <img src={SearchIcon} alt="Search" className="admin-employee-search-icon" />
          </div>

          {/* Employee Cards */}
          <div className="admin-employee-list">
            {employeeList.map((employee) => (
              <div key={employee.id} className="admin-employee-card">
                <div className="admin-employee-card-header">
                  <div className="admin-employee-card-info">
                    <h3 className="admin-employee-name">{employee.name}</h3>
                    <p className="admin-employee-position">{employee.position}</p>
                  </div>
                </div>

                <div className="admin-employee-card-details">
                  <div className="admin-employee-detail-item">
                    <img src={MailIcon} alt="Email" className="admin-employee-detail-icon" />
                    <span className="admin-employee-detail-text">{employee.email}</span>
                  </div>
                  <div className="admin-employee-detail-item">
                    <img src={PhoneIcon} alt="Phone" className="admin-employee-detail-icon" />
                    <span className="admin-employee-detail-text">{employee.phone}</span>
                  </div>
                  <p className="admin-employee-join-date">
                    Ngày vào làm: {employee.joinDate}
                  </p>
                </div>

                <div className="admin-employee-card-actions">
                  <button className="admin-employee-action-btn edit" onClick={() => openEditModal(employee)}>
                    <img src={ModifyIcon} alt="Edit" className="admin-employee-action-icon" />
                    <span>Sửa</span>
                  </button>
                  <button className="admin-employee-action-btn delete" onClick={() => openDeleteModal(employee)}>
                    <img src={DeleteIcon} alt="Delete" className="admin-employee-action-icon" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={handleAddEmployee} 
      />
      <EditEmployeeModal 
        isOpen={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
        }} 
        onUpdate={handleEditEmployee}
        employee={selectedEmployee}
      />
      <DeleteEmployeeModal 
        isOpen={showDeleteModal} 
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEmployee(null);
        }} 
        onDelete={handleDeleteEmployee}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default EmployeeManagementPage;
