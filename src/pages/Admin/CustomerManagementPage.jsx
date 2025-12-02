import React, { useState, useEffect } from 'react';
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
import { getAllGuests } from '../../api/guestApi';
import { getGuestById } from '../../api/guestApi';

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const result = await getAllGuests();
      if (result.success) {
        const rawData = result.guests;
        
        const mappedCustomers = rawData.map((guest) => ({
          id: guest.guestId,
          name: guest.fullName,
          cccd: guest.cccd,
          gender: guest.gender,
          room: guest.roomNumber || null,
          roomType: guest.typeRoom || null,
        }));
        setCustomers(mappedCustomers);

      } else {
        // Handle error, e.g., show a notification
        console.error(result.message);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewDetail = async(customer) => {
    const result = await getGuestById(customer.id);
    console.log("Fetched guest detail:", result.guest);
    console.log("Customer ID:", customer.id);
    if (result.success) {
      setSelectedCustomer(result.guest);
      setShowDetailModal(true);
    } else {
      console.error(result.message);
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cccd.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.room && customer.room.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                placeholder="Tìm kiếm khách hàng theo tên, cccd, số phòng..."
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
                {filteredCustomers.map((customer, index) => (
                  <tr key={customer.id || index} className={index === 6 ? 'last-row' : ''}>
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
                        <span className="admin-customer-info-text">{customer.gender === 'Male' ? 'Nam' : 'Nữ'}</span>
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
