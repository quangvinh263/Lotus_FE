import React, { useState, useEffect } from 'react';
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
import { getAllEmployees } from '../../api/employeeApi';


const EmployeeManagementPage = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [stats, setStats] = useState([]);``
  const [isLoading, setIsLoading] = useState(false); // Thêm dòng này
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const result = await getAllEmployees();
        console.log("Kết quả trả về từ API:", result);
        // Kiểm tra kết quả trả về từ API
        // Lưu ý: Backend trả về { success: true, data: [...] }
        if (result && result.success && Array.isArray(result.employees)) {
          const mappedEmployees = result.employees.map((emp) => ({
            // Sử dụng toán tử || để dự phòng nếu tên field bên API khác
            id: emp.employeeId,
            name: emp.fullName || emp.name || 'Không có tên', 
            position: emp.position || 'Nhân viên',
            email: emp.email,
            phone: emp.phoneNumber,
            isActive: emp.isActive,
            // Format ngày tháng từ ISO string sang dd/mm/yyyy
            joinDate: emp.createdAt ? new Date(emp.createdAt).toLocaleDateString('vi-VN') : 'N/A',
          }));
          setEmployeeList(mappedEmployees);
          setStats([
            {
              label: 'Tổng nhân viên',
              value: mappedEmployees.length.toString(),
              color: '#133E87'
            },
            {
              label: 'Đang làm việc',
              value: result.employees.filter(emp => emp.isActive).length.toString(),
              color: '#00A63E'
            },
            {
              label: 'Tuyển mới tháng này',
              value: result.employees.filter(emp => {
                if (!emp.createdAt) return false;
                const joinDate = new Date(emp.createdAt);
                const now = new Date();
                return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
              }).length.toString(),
              color: '#133E87'
            }
          ]);
          console.log("Danh sách nhân viên đã được cập nhật:", mappedEmployees);
        } else {
          console.error("Lỗi lấy dữ liệu:", result?.message);
        }
      } catch (error) {
        console.error("Lỗi hệ thống:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  

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
                  <span className={`admin-employee-status ${employee.isActive ? 'active' : 'inactive'}`}>
                    {employee.isActive ? 'Đang làm việc' : 'Đã nghỉ'}
                  </span>
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
