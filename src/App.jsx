import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Public/HomePage'
import SignInPage from './pages/Auth/SignInPage'
import SignUpPage from './pages/Auth/SignUpPage'
import FirstTimePersonalInfoPage from './pages/Auth/FirstTimePersonalInfoPage'
import ProfilePage from './pages/Public/ProfilePage'
import RoomsPage from './pages/Public/RoomsPage'
import RoomDetailsPage from './pages/Public/RoomDetailsPage'
import FacilitiesPage from './pages/Public/FacilitiesPage'
import AboutUsPage from './pages/Public/AboutUsPage'
import BookingPage from './pages/Public/BookingPage'
import GuestInfoPage from './pages/Public/GuestInfoPage'
import PaymentPage from './pages/Public/PaymentPage'
import ReceptionDashboard from './pages/Reception/ReceptionDashboard'
import ServiceManagementPage from './pages/Reception/ServiceManagementPage'
import BookingManagementPage from './pages/Reception/BookingManagementPage'
import CreateBookingPage from './pages/Reception/CreateBookingPage'
import CheckOutManagement from './pages/Reception/CheckOutManagement'
import CheckInManagement from './pages/Reception/CheckInManagement';
import DashboardPage from './pages/Admin/DashboardPage';
import EmployeeManagementPage from './pages/Admin/EmployeeManagementPage';
import RoomManagementPage from './pages/Admin/RoomManagementPage';
import BookingOrderManagementPage from './pages/Admin/BookingOrderManagementPage';
import CustomerManagementPage from './pages/Admin/CustomerManagementPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/complete-profile" element={<FirstTimePersonalInfoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/room-details/:roomId" element={<RoomDetailsPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/guest-info" element={<GuestInfoPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        
        {/* Reception Routes */}
        <Route path="/reception/dashboard" element={<ReceptionDashboard />} />
        <Route path="/reception/services" element={<ServiceManagementPage />} />
        <Route path="/reception/booking-management" element={<BookingManagementPage />} />
        <Route path="/reception/create-booking" element={<CreateBookingPage />} />
        <Route path="/reception/checkout" element={<CheckOutManagement />} />
        <Route path="/reception/checkin" element={<CheckInManagement />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/employees" element={<EmployeeManagementPage />} />
        <Route path="/admin/rooms" element={<RoomManagementPage />} />
        <Route path="/admin/bookings" element={<BookingOrderManagementPage />} />
        <Route path="/admin/customers" element={<CustomerManagementPage />} />
      </Routes>
 </Router>
  )
}
export default App
