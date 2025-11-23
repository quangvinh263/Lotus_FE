import React, { useState } from 'react';
import '../../styles/Admin/RevenueReportPage.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import DownFallIcon from '../../assets/icons/DownFallIcon.svg';
import MoneyIcon from '../../assets/icons/MoneyIcon.svg';
import HotelIcon from '../../assets/icons/HotelIcon.svg';
import ServiceIcon from '../../assets/icons/ServiceIcon.svg';
import RevenueIcon from '../../assets/icons/RevenueIcon.svg';
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
  // Data for monthly revenue chart (Line chart)
  const monthlyRevenueChart = [
    { month: 'T1', value: 320 },
    { month: 'T2', value: 280 },
    { month: 'T3', value: 350 },
    { month: 'T4', value: 400 },
    { month: 'T5', value: 380 },
    { month: 'T6', value: 450 }
  ];

  // Data for service revenue chart (Bar chart)
  const serviceRevenueChart = [
    { name: 'Phòng', value: 2200 },
    { name: 'Ăn uống', value: 800 },
    { name: 'Spa', value: 500 },
    { name: 'Giặt ủi', value: 200 },
    { name: 'Khác', value: 300 }
  ];

  // Sample data for revenue by month (table data)
  const monthlyData = [
    { month: 'T1', total: '320 triệu đồng', orders: '26 đơn', room: '140 triệu đồng', service: '180 triệu đồng', average: '12,3 triệu đồng' },
    { month: 'T2', total: '280 triệu đồng', orders: '25 đơn', room: '120 triệu đồng', service: '160 triệu đồng', average: '11,2 triệu đồng' },
    { month: 'T3', total: '350 triệu đồng', orders: '30 đơn', room: '160 triệu đồng', service: '190 triệu đồng', average: '11,6 triệu đồng' },
    { month: 'T4', total: '400 triệu đồng', orders: '20 đơn', room: '190 triệu đồng', service: '210 triệu đồng', average: '20 triệu đồng' },
    { month: 'T5', total: '380 triệu đồng', orders: '15 đơn', room: '180 triệu đồng', service: '200 triệu đồng', average: '25,3 triệu đồng' },
    { month: 'T6', total: '450 triệu đồng', orders: '32 đơn', room: '200 triệu đồng', service: '250 triệu đồng', average: '14 triệu đồng' },
  ];

  // Sample data for top room types
  const topRoomTypes = [
    { rank: '#1', name: 'Superior', bookings: '45 lượt đặt', revenue: '67.5 triệu đồng' },
    { rank: '#2', name: 'Deluxe', bookings: '38 lượt đặt', revenue: '30.4 triệu đồng' },
    { rank: '#3', name: 'Executive', bookings: '15 lượt đặt', revenue: '37.5 triệu đồng' },
    { rank: '#4', name: 'Grand Suite', bookings: '58 lượt đặt', revenue: '29 triệu đồng' },
    { rank: '#5', name: 'Lotus Suite', bookings: '58 lượt đặt', revenue: '29 triệu đồng' },
  ];

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
                <div className="admin-revenue-stat-change positive">
                  <img src={DownFallIcon} alt="Up" />
                  <span>+12%</span>
                </div>
              </div>
              <p className="admin-revenue-stat-label">Doanh thu tháng này</p>
              <p className="admin-revenue-stat-value">450M đ</p>
            </div>

            <div className="admin-revenue-stat-card revenue-room">
              <div className="admin-revenue-stat-top">
                <div className="admin-revenue-stat-icon revenue-room-icon">
                  <img src={HotelIcon} alt="Hotel" className="revenue-icon-red" />
                </div>
                <div className="admin-revenue-stat-change positive">
                  <img src={DownFallIcon} alt="Up" />
                  <span>+5%</span>
                </div>
              </div>
              <p className="admin-revenue-stat-label">Doanh thu phòng</p>
              <p className="admin-revenue-stat-value">220M đ</p>
            </div>

            <div className="admin-revenue-stat-card revenue-service">
              <div className="admin-revenue-stat-top">
                <div className="admin-revenue-stat-icon revenue-service-icon">
                  <img src={ServiceIcon} alt="Service" className="revenue-icon-blue" />
                </div>
                <div className="admin-revenue-stat-change positive">
                  <img src={DownFallIcon} alt="Up" />
                  <span>+28%</span>
                </div>
              </div>
              <p className="admin-revenue-stat-label">Doanh thu dịch vụ</p>
              <p className="admin-revenue-stat-value">230M đ</p>
            </div>

            <div className="admin-revenue-stat-card revenue-average">
              <div className="admin-revenue-stat-top">
                <div className="admin-revenue-stat-icon revenue-average-icon">
                  <img src={RevenueIcon} alt="Revenue" className="revenue-icon-purple" />
                </div>
                <div className="admin-revenue-stat-change positive">
                  <img src={DownFallIcon} alt="Up" />
                  <span>+8%</span>
                </div>
              </div>
              <p className="admin-revenue-stat-label">Trung bình/ngày</p>
              <p className="admin-revenue-stat-value">15M đ</p>
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
                    domain={[0, 600]}
                    ticks={[0, 150, 300, 450, 600]}
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
                  data={serviceRevenueChart}
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
                    domain={[0, 2800]}
                    ticks={[0, 700, 1400, 2100, 2800]}
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
            <h3>Loại phòng có doanh thu cao nhất</h3>
            <div className="admin-revenue-room-cards">
              {topRoomTypes.map((room, index) => (
                <div key={index} className="admin-revenue-room-card">
                  <div className="admin-revenue-room-header">
                    <h4>{room.name}</h4>
                    <div className="admin-revenue-room-rank">{room.rank}</div>
                  </div>
                  <p className="admin-revenue-room-bookings">{room.bookings}</p>
                  <p className="admin-revenue-room-revenue">{room.revenue}</p>
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
                {monthlyData.map((data, index) => (
                  <tr key={index}>
                    <td className="month-cell">{data.month}</td>
                    <td className="total-cell">{data.total}</td>
                    <td className="orders-cell">{data.orders}</td>
                    <td className="room-cell">{data.room}</td>
                    <td className="service-cell">{data.service}</td>
                    <td className="average-cell">{data.average}</td>
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
