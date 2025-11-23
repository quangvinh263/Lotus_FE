import React from 'react';
import '../../styles/Admin/DashboardPage.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import PeopleIcon from '../../assets/icons/PeopleIcon.svg';
import HotelIcon from '../../assets/icons/HotelIcon.svg';
import MoneyIcon from '../../assets/icons/MoneyIcon.svg';
import ReservationIcon from '../../assets/icons/ReservationIcon.svg';
import CalendarIcon from '../../assets/icons/CalenderIcon.svg';
import CustomerIcon from '../../assets/icons/CustomerIcon.svg';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DashboardPage = () => {
  // Dữ liệu cho biểu đồ doanh thu 6 tháng
  const revenueData = [
    { month: 'T1', value: 350 },
    { month: 'T2', value: 380 },
    { month: 'T3', value: 420 },
    { month: 'T4', value: 500 },
    { month: 'T5', value: 480 },
    { month: 'T6', value: 550 }
  ];

  // Dữ liệu cho biểu đồ tỷ lệ lấp đầy theo tuần
  const occupancyData = [
    { day: 'T2', value: 75 },
    { day: 'T3', value: 82 },
    { day: 'T4', value: 88 },
    { day: 'T5', value: 91 },
    { day: 'T6', value: 85 },
    { day: 'T7', value: 78 },
    { day: 'CN', value: 80 }
  ];

  // Dữ liệu cho biểu đồ thống kê đặt phòng
  const bookingData = [
    { month: 'May', value: 85 },
    { month: 'Jun', value: 70 },
    { month: 'Jul', value: 90 },
    { month: 'Aug', value: 60 },
    { month: 'Sep', value: 95 },
    { month: 'Oct', value: 88 },
    { month: 'Nov', value: 92 },
    { month: 'Dec', value: 85 },
    { month: 'Jan', value: 78 },
    { month: 'Feb', value: 82 }
  ];

  const statsCards = [
    {
      id: 1,
      title: 'Tổng nhân viên',
      value: '45',
      change: '+5%',
      changeType: 'positive',
      icon: PeopleIcon,
      iconClass: 'icon-people'
    },
    {
      id: 2,
      title: 'Tổng phòng',
      value: '100',
      change: '0%',
      changeType: 'neutral',
      icon: HotelIcon,
      iconClass: 'icon-room'
    },
    {
      id: 3,
      title: 'Doanh thu tháng',
      value: '450M VNĐ',
      change: '+12%',
      changeType: 'positive',
      icon: MoneyIcon,
      iconClass: 'icon-money'
    },
    {
      id: 4,
      title: 'Tỷ lệ lấp đầy',
      value: '86%',
      change: '+8%',
      changeType: 'positive',
      icon: ReservationIcon,
      iconClass: 'icon-reservation'
    },
    {
      id: 5,
      title: 'Đặt phòng mới',
      value: '156',
      change: '+18%',
      changeType: 'positive',
      icon: CalendarIcon,
      iconClass: 'icon-calendar'
    },
    {
      id: 6,
      title: 'Khách hàng',
      value: '1,234',
      change: '+15%',
      changeType: 'positive',
      icon: CustomerIcon,
      iconClass: 'icon-customer'
    }
  ];

  return (
    <div className="admin-dashboard-page">
      <AdminSidebar />
      <div className="admin-dashboard-container">
        <AdminHeader />
        <div className="admin-dashboard-main">
          <div className="admin-dashboard-header">
            <h1 className="admin-dashboard-title">Tổng quan</h1>
            <p className="admin-dashboard-subtitle">Thống kê và quản lý tổng thể khách sạn</p>
          </div>

          {/* Stats Cards */}
          <div className="admin-stats-grid">
            {statsCards.map((card) => (
              <div key={card.id} className="admin-stat-card">
                <div className="admin-stat-header">
                  <div className={`admin-stat-icon ${card.iconClass}`}>
                    <img src={card.icon} alt={card.title} />
                  </div>
                  <span className={`admin-stat-change ${card.changeType}`}>
                    {card.change}
                  </span>
                </div>
                <p className="admin-stat-label">{card.title}</p>
                <h2 className="admin-stat-value">{card.value}</h2>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="admin-charts-row">
            <div className="admin-chart-card">
              <h3 className="admin-chart-title">Doanh thu 6 tháng gần đây (triệu vnđ)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#CBDCEB" />
                  <XAxis dataKey="month" stroke="#608BC1" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#608BC1" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#608BC1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="admin-chart-card">
              <h3 className="admin-chart-title">Tỷ lệ lấp đầy theo tuần (%)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#CBDCEB" />
                  <XAxis dataKey="day" stroke="#608BC1" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#608BC1" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#133E87" 
                    strokeWidth={3}
                    dot={{ fill: '#133E87', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="admin-bottom-section">
            <div className="admin-suggestion-card">
              <div className="admin-suggestion-header">
                <h3 className="admin-section-title">Gợi ý</h3>
                <button className="admin-more-btn">
                  <span>⋮</span>
                </button>
              </div>
              <div className="admin-suggestion-content">
                <div className="admin-suggestion-input">
                  <input 
                    type="text" 
                    placeholder="Tôi cần phải làm gì để khách sạn thu hút hơn?"
                    className="admin-suggestion-textbox"
                  />
                  <button className="admin-suggestion-submit">
                    <span>▼</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-booking-stats-card">
              <div className="admin-booking-header">
                <h3 className="admin-section-title">Thống kê lượng đặt phòng</h3>
                <button className="admin-filter-btn">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6.67 1.67H13.33V5H6.67V1.67Z" stroke="#667085" strokeWidth="1.67"/>
                    <path d="M3.33 4H16.67V18.33H3.33V4Z" stroke="#667085" strokeWidth="1.67"/>
                  </svg>
                  Monthly
                </button>
              </div>
              <div className="admin-booking-chart">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={bookingData}>
                    <XAxis dataKey="month" stroke="#858D9D" style={{ fontSize: '12px' }} />
                    <Bar dataKey="value" fill="#133E87" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
