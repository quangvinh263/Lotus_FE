import React, { useState, useEffect } from 'react';
import '../../styles/Admin/RevenueReportPage.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import DownFallIcon from '../../assets/icons/DownFallIcon.svg';
import MoneyIcon from '../../assets/icons/MoneyIcon.svg';
import HotelIcon from '../../assets/icons/HotelIcon.svg';
import ServiceIcon from '../../assets/icons/ServiceIcon.svg';
import RevenueIcon from '../../assets/icons/RevenueIcon.svg';
import signalRService from '../../services/statiticsService';
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

const RevenueReportPage = () => {
  const [revenueData, setRevenueData] = useState({
    overview: {
      monthlyRevenue: 0,
      revenueGrowthPercent: 0,
      roomRevenue: 0,
      roomGrowthPercent: 0,
      serviceRevenue: 0,
      serviceGrowthPercent: 0,
      averageRevenuePerDay: 0,
      averageGrowthPercent: 0
    },
    monthlyRevenueChart: [],
    serviceRevenueChart: [],
    monthlyDetails: [],
    topRoomTypes: []
  });

  useEffect(() => {
    // Kết nối SignalR
    signalRService.startConnection();

    // Lắng nghe dữ liệu từ SignalR
    signalRService.onAnalyticsUpdate((receivedData) => {
      console.log('📊 Received revenue data:', receivedData);
      // ✅ Sửa: Backend trả về { timestamp, data } thay vì { success, data }
      if (receivedData && receivedData.data) {
        setRevenueData(receivedData.data);
      }
    });

    // Cleanup khi unmount
    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const { overview, monthlyRevenueChart, serviceRevenueChart, monthlyDetails, topRoomTypes } = revenueData;

  return (
    <div className="admin-revenue-report-page">
      <AdminSidebar />
      <div className="admin-revenue-report-content">
        <AdminHeader />
        <div className="admin-revenue-report-container">
          {/* Header Section */}
          <div className="admin-revenue-report-header">
            <h1>Báo cáo doanh thu</h1>
            <p>Thống kê doanh thu và lợi nhuận chi tiết</p>
          </div>

          {/* Stats Cards Section */}
          <div className="admin-revenue-stats">
            <div className="admin-revenue-stat-card revenue-total">
              <div className="admin-revenue-stat-top">
                <div className="admin-revenue-stat-icon revenue-total-icon">
                  <img src={MoneyIcon} alt="Money" className="revenue-icon-green" />
                </div>
                <div className={`admin-revenue-stat-change ${overview.revenueGrowthPercent >= 0 ? 'positive' : 'negative'}`}>
                  <img src={DownFallIcon} alt="Change" style={{ transform: overview.revenueGrowthPercent < 0 ? 'rotate(180deg)' : 'none' }} />
                  <span>{overview.revenueGrowthPercent >= 0 ? '+' : ''}{overview.revenueGrowthPercent.toFixed(1)}%</span>
                </div>
              </div>
              <p className="admin-revenue-stat-label">Doanh thu tháng này</p>
              <p className="admin-revenue-stat-value">{overview.monthlyRevenue.toFixed(1)}M đ</p>
            </div>

            <div className="admin-revenue-stat-card revenue-room">
              <div className="admin-revenue-stat-top">
                <div className="admin-revenue-stat-icon revenue-room-icon">
                  <img src={HotelIcon} alt="Hotel" className="revenue-icon-red" />
                </div>
                <div className={`admin-revenue-stat-change ${overview.roomGrowthPercent >= 0 ? 'positive' : 'negative'}`}>
                  <img src={DownFallIcon} alt="Change" style={{ transform: overview.roomGrowthPercent < 0 ? 'rotate(180deg)' : 'none' }} />
                  <span>{overview.roomGrowthPercent >= 0 ? '+' : ''}{overview.roomGrowthPercent.toFixed(1)}%</span>
                </div>
              </div>
              <p className="admin-revenue-stat-label">Doanh thu phòng</p>
              <p className="admin-revenue-stat-value">{overview.roomRevenue.toFixed(1)}M đ</p>
            </div>

            <div className="admin-revenue-stat-card revenue-service">
              <div className="admin-revenue-stat-top">
                <div className="admin-revenue-stat-icon revenue-service-icon">
                  <img src={ServiceIcon} alt="Service" className="revenue-icon-blue" />
                </div>
                <div className={`admin-revenue-stat-change ${overview.serviceGrowthPercent >= 0 ? 'positive' : 'negative'}`}>
                  <img src={DownFallIcon} alt="Change" style={{ transform: overview.serviceGrowthPercent < 0 ? 'rotate(180deg)' : 'none' }} />
                  <span>{overview.serviceGrowthPercent >= 0 ? '+' : ''}{overview.serviceGrowthPercent.toFixed(1)}%</span>
                </div>
              </div>
              <p className="admin-revenue-stat-label">Doanh thu dịch vụ</p>
              <p className="admin-revenue-stat-value">{overview.serviceRevenue.toFixed(1)}M đ</p>
            </div>

            <div className="admin-revenue-stat-card revenue-average">
              <div className="admin-revenue-stat-top">
                <div className="admin-revenue-stat-icon revenue-average-icon">
                  <img src={RevenueIcon} alt="Revenue" className="revenue-icon-purple" />
                </div>
                <div className={`admin-revenue-stat-change ${overview.averageGrowthPercent >= 0 ? 'positive' : 'negative'}`}>
                  <img src={DownFallIcon} alt="Change" style={{ transform: overview.averageGrowthPercent < 0 ? 'rotate(180deg)' : 'none' }} />
                  <span>{overview.averageGrowthPercent >= 0 ? '+' : ''}{overview.averageGrowthPercent.toFixed(1)}%</span>
                </div>
              </div>
              <p className="admin-revenue-stat-label">Trung bình/ngày</p>
              <p className="admin-revenue-stat-value">{overview.averageRevenuePerDay.toFixed(2)}M đ</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="admin-revenue-charts">
            <div className="admin-revenue-chart-card">
              <h3>Doanh thu phòng theo tháng</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#CBDCEB" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#608BC1" 
                    style={{ fontSize: '12px', fontFamily: 'Arial' }}
                  />
                  <YAxis 
                    stroke="#608BC1" 
                    style={{ fontSize: '12px', fontFamily: 'Arial' }}
                  />
                  <Tooltip 
                    contentStyle={{ fontFamily: 'Arial' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#133E87" 
                    strokeWidth={3}
                    dot={{ fill: '#133E87', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="admin-chart-legend">
                <div className="admin-chart-legend-item">
                  <div className="admin-legend-dot" style={{ backgroundColor: '#133E87' }}></div>
                  <span>Doanh thu</span>
                </div>
              </div>
            </div>

            <div className="admin-revenue-chart-card">
              <h3>Doanh thu theo dịch vụ (Triệu VNĐ)</h3>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart 
                  data={serviceRevenueChart.map(item => ({
                    name: item.serviceName,
                    value: item.totalRevenue / 1000000 // Chuyển đổi sang triệu
                  }))}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#CBDCEB" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#608BC1" 
                    style={{ fontSize: '12px', fontFamily: 'Arial' }}
                  />
                  <YAxis 
                    stroke="#608BC1" 
                    style={{ fontSize: '12px', fontFamily: 'Arial' }}
                  />
                  <Tooltip 
                    contentStyle={{ fontFamily: 'Arial' }}
                  />
                  <Bar dataKey="value" fill="#133E87" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Room Types Section */}
          <div className="admin-revenue-top-rooms">
            <h3>Loại phòng có doanh thu cao nhất tháng</h3>
            <div className="admin-revenue-room-cards">
              {topRoomTypes.map((room, index) => (
                <div key={index} className="admin-revenue-room-card">
                  <div className="admin-revenue-room-header">
                    <h4>{room.name}</h4>
                    <div className="admin-revenue-room-rank">{room.rank}</div>
                  </div>
                  <p className="admin-revenue-room-bookings">{room.bookings} lượt đặt</p>
                  <p className="admin-revenue-room-revenue">{(room.revenue / 1000000).toFixed(1)} triệu đồng</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Table Section */}
          <div className="admin-revenue-table-container">
            <table className="admin-revenue-table">
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Doanh thu tổng</th>
                  <th>Số đơn đặt</th>
                  <th>Doanh thu phòng</th>
                  <th>Doanh thu dịch vụ</th>
                  <th>Trung bình / đơn</th>
                </tr>
              </thead>
              <tbody>
                {monthlyDetails.map((data, index) => (
                  <tr key={index}>
                    <td className="month-cell">{data.month}</td>
                    <td className="total-cell">{(data.totalRevenue / 1000000).toFixed(2)} triệu đồng</td>
                    <td className="orders-cell">{data.orderCount} đơn</td>
                    <td className="room-cell">{(data.roomRevenue / 1000000).toFixed(2)} triệu đồng</td>
                    <td className="service-cell">{(data.serviceRevenue / 1000000).toFixed(2)} triệu đồng</td>
                    <td className="average-cell">{(data.averagePerOrder / 1000000).toFixed(2)} triệu đồng</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReportPage;
