import React, { useEffect, useState } from 'react';
import '../../styles/Admin/DashboardPage.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import AIInsightModal from '../../components/Admin/AIInsightModal';
import PeopleIcon from '../../assets/icons/PeopleIcon.svg';
import HotelIcon from '../../assets/icons/HotelIcon.svg';
import MoneyIcon from '../../assets/icons/MoneyIcon.svg';
import ReservationIcon from '../../assets/icons/ReservationIcon.svg';
import CalendarIcon from '../../assets/icons/CalenderIcon.svg';
import CustomerIcon from '../../assets/icons/CustomerIcon.svg';
import signalRService from '../../services/signalRService';
import { getAvailableQuestions, generateInsight } from '../../api/campaign';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const now = new Date();
const currentMonthNumber = now.getMonth() + 1;
const currentMonth = now.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });

const DashboardPage = () => {
  const getMonthLabel = (offset) => {
    const monthIndex = ((currentMonthNumber - 1 + offset) % 12 + 12) % 12;
    return `T${monthIndex + 1}`;
  };

  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    totalRooms: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    newBookings: 0,
    totalCustomers: 0,
    revenueGrowthPercent: 0,
    occupancyGrowthPercent: 0,
    bookingGrowthPercent: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const questionsRes = await getAvailableQuestions();
      if (questionsRes && questionsRes.success) {
        setQuestions(questionsRes.data);
      }

      await signalRService.startConnection();
      signalRService.onAnalyticsUpdate((response) => {
        const data = response.data;
        setLastUpdate(response.timestamp);

        setStatsData({
          totalEmployees: data.totalEmployees || 0,
          totalRooms: data.totalRooms || 0,
          monthlyRevenue: data.monthlyRevenue || 0,
          occupancyRate: data.currentOccupancyRate || 0,
          newBookings: data.newBookingsThisMonth || 0,
          totalCustomers: data.totalCustomers || 0,
          revenueGrowthPercent: data.revenueGrowthPercent ?? 0,
          occupancyGrowthPercent: data.occupancyGrowthPercent ?? 0,
          bookingGrowthPercent: data.bookingGrowthPercent ?? 0
        });

        setRevenueData([
          { month: getMonthLabel(-5), value: data.revenueMonth1 || 0 },
          { month: getMonthLabel(-4), value: data.revenueMonth2 || 0 },
          { month: getMonthLabel(-3), value: data.revenueMonth3 || 0 },
          { month: getMonthLabel(-2), value: data.revenueMonth4 || 0 },
          { month: getMonthLabel(-1), value: data.revenueMonth5 || 0 },
          { month: getMonthLabel(0), value: data.revenueMonth6 || 0 }
        ]);

        setOccupancyData([
          { day: 'T2', value: data.occupancyWeek2 || 0 },
          { day: 'T3', value: data.occupancyWeek3 || 0 },
          { day: 'T4', value: data.occupancyWeek4 || 0 },
          { day: 'T5', value: data.occupancyWeek5 || 0 },
          { day: 'T6', value: data.occupancyWeek6 || 0 },
          { day: 'T7', value: data.occupancyWeek7 || 0 },
          { day: 'CN', value: data.occupancyWeekCN || 0 }
        ]);

        setBookingData([
          { month: 'Jan', value: data.bookingJan || 0 },
          { month: 'Feb', value: data.bookingFeb || 0 },
          { month: 'Mar', value: data.bookingMar || 0 },
          { month: 'Apr', value: data.bookingApr || 0 },
          { month: 'May', value: data.bookingMay || 0 },
          { month: 'Jun', value: data.bookingJun || 0 },
          { month: 'Jul', value: data.bookingJul || 0 },
          { month: 'Aug', value: data.bookingAug || 0 },
          { month: 'Sep', value: data.bookingSep || 0 },
          { month: 'Oct', value: data.bookingOct || 0 },
          { month: 'Nov', value: data.bookingNov || 0 },
          { month: 'Dec', value: data.bookingDec || 0 }
        ]);
      });
    };

    fetchData();

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const handleGenerateInsight = async (questionId) => {
    const response = await generateInsight(questionId);
    if (response && response.success) {
      return response.data.insights;
    } else {
      throw new Error("Failed to generate insight");
    }
  };

  const statsCards = [
    {
      id: 1,
      title: 'Tổng nhân viên',
      value: statsData.totalEmployees,
      changeType: 'positive',
      icon: PeopleIcon,
      iconClass: 'icon-people'
    },
    {
      id: 2,
      title: 'Tổng phòng',
      value: statsData.totalRooms,
      changeType: 'neutral',
      icon: HotelIcon,
      iconClass: 'icon-room'
    },
    {
      id: 3,
      title: `Doanh thu ${currentMonth}`,
      value: `${statsData.monthlyRevenue}M VNĐ`,
      change: `${statsData.revenueGrowthPercent.toFixed(1)}%`,
      changeType: statsData.revenueGrowthPercent >= 0 ? 'positive' : 'neutral',
      icon: MoneyIcon,
      iconClass: 'icon-money'
    },
    {
      id: 4,
      title: 'Tỷ lệ lấp đầy',
      value: `${statsData.occupancyRate}%`,
      change: `${statsData.occupancyGrowthPercent.toFixed(1)}%`,
      changeType: statsData.occupancyGrowthPercent >= 0 ? 'positive' : 'neutral',
      icon: ReservationIcon,
      iconClass: 'icon-reservation'
    },
    {
      id: 5,
      title: 'Đặt phòng mới',
      value: statsData.newBookings,
      change: `${statsData.bookingGrowthPercent.toFixed(1)}%`,
      changeType: statsData.bookingGrowthPercent >= 0 ? 'positive' : 'neutral',
      icon: CalendarIcon,
      iconClass: 'icon-calendar'
    },
    {
      id: 6,
      title: 'Khách hàng thành viên',
      value: statsData.totalCustomers.toLocaleString(),
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
            <p className="admin-dashboard-subtitle">
              Thống kê và quản lý tổng thể khách sạn
              {lastUpdate && <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                (Cập nhật lúc: {new Date(lastUpdate).toLocaleTimeString()})
              </span>}
            </p>
          </div>

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

          <div className="admin-charts-row">
            <div className="admin-chart-card">
              <h3 className="admin-chart-title">Doanh thu 6 tháng gần đây (triệu đồng)</h3>
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

          <div className="admin-bottom-section">
            {/* ✅ Thay Card thành Button đơn giản */}
            <button 
              className="admin-ai-insight-button"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="ai-button-text">Gợi ý & Phân tích</span>
            </button>

            <div className="admin-booking-stats-card">
              <div className="admin-booking-header">
                <h3 className="admin-section-title">Thống kê lượng đặt phòng (%)</h3>
                <button className="admin-filter-btn">Monthly</button>
              </div>
              <div className="admin-booking-chart">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CBDCEB" />
                    <XAxis dataKey="month" stroke="#858D9D" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#858D9D" style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#133E87" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIInsightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        questions={questions}
        onGenerate={handleGenerateInsight}
      />
    </div>
  );
};

export default DashboardPage;
