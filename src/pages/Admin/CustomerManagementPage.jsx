import React, { useState } from 'react';
import '../../styles/Admin/CustomerManagementPage.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import CustomerDetailModal from '../../components/Admin/CustomerDetailModal';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import FilterIcon from '../../assets/icons/FilterIcon.svg';
import GenderIcon from '../../assets/icons/GenderIcon.svg';
import WalletIcon from '../../assets/icons/WalletIcon.svg';
import HotelIcon from '../../assets/icons/HotelIcon.svg';
import EyeIcon from '../../assets/icons/EyeIcon.svg';

const CustomerManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Sample customer data
  const customers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      cccd: '001234567890',
      gender: 'Nam',
      room: 'P101',
      roomType: 'Deluxe',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      cccd: '001234567891',
      gender: 'Nữ',
      room: null,
      roomType: null,
    },
    {
      id: 3,
      name: 'Lê Văn C',
      cccd: '001234567892',
      gender: 'Nam',
      room: 'P205',
      roomType: 'Suite',
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      cccd: '001234567893',
      gender: 'Nữ',
      room: null,
      roomType: null,
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      cccd: '001234567894',
      gender: 'Nam',
      room: 'P302',
      roomType: 'Superior',
    },
    {
      id: 6,
      name: 'Ngô Thị F',
      cccd: '001234567895',
      gender: 'Nữ',
      room: 'P103',
      roomType: 'Lotus Suite',
    },
    {
      id: 7,
      name: 'Đặng Văn G',
      cccd: '001234567896',
      gender: 'Nam',
      room: null,
      roomType: null,
    },
  ];

  const handleViewDetail = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="admin-customer-management-page">
      <AdminSidebar activeMenu="customers" />
      <div className="admin-customer-management-content">
        <AdminHeader />
        <div className="admin-customer-management-container">
          <div className="admin-customer-management-header">
            <h1>Quản lý khách hàng</h1>
            <p>Quản lý thông tin và lịch sử khách hàng</p>
          </div>

          <div className="admin-customer-management-search-container">
            <div className="admin-customer-management-search-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng theo tên, email, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-customer-management-search-input"
              />
              <img
                src={SearchIcon}
                alt="Search"
                className="admin-customer-management-search-icon"
              />
            </div>
            <button className="admin-customer-management-filter-btn">
              <img src={FilterIcon} alt="Filter" />
              <span>Lọc</span>
            </button>
          </div>

          <div className="admin-customer-management-table-container">
            <table className="admin-customer-management-table">
              <thead>
                <tr>
                  <th>Tên khách hàng</th>
                  <th>CCCD</th>
                  <th>Giới tính</th>
                  <th>Phòng đang ở</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer.id} className={index === 6 ? 'last-row' : ''}>
                    <td>
                      <div className="admin-customer-name">{customer.name}</div>
                    </td>
                    <td>
                      <div className="admin-customer-info-with-icon">
                        <img src={WalletIcon} alt="CCCD" className="admin-customer-info-icon" />
                        <span className="admin-customer-info-text">{customer.cccd}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-customer-info-with-icon">
                        <img src={GenderIcon} alt="Gender" className="admin-customer-info-icon" />
                        <span className="admin-customer-info-text">{customer.gender}</span>
                      </div>
                    </td>
                    <td>
                      {customer.room ? (
                        <div className="admin-customer-room-info">
                          <div className="admin-customer-room-number">
                            <img src={HotelIcon} alt="Room" className="admin-customer-info-icon" />
                            <span>{customer.room}</span>
                          </div>
                          <div className="admin-customer-room-type">{customer.roomType}</div>
                        </div>
                      ) : (
                        <div className="admin-customer-no-room"></div>
                      )}
                    </td>
                    <td>
                      <button
                        className="admin-customer-detail-btn"
                        onClick={() => handleViewDetail(customer)}
                      >
                        <img src={EyeIcon} alt="View" className="admin-customer-action-icon" />
                        <span>Chi tiết</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CustomerDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomerManagementPage;
