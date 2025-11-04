import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Public/HomePage'
import SignInPage from './pages/Auth/SignInPage'
import SignUpPage from './pages/Auth/SignUpPage'
import ProfilePage from './pages/Public/ProfilePage'
import RoomsPage from './pages/Public/RoomsPage'
import RoomDetailsPage from './pages/Public/RoomDetailsPage'
import FacilitiesPage from './pages/Public/FacilitiesPage'
import AboutUsPage from './pages/Public/AboutUsPage'
import BookingPage from './pages/Public/BookingPage'
import GuestInfoPage from './pages/Public/GuestInfoPage'
import PaymentPage from './pages/Public/PaymentPage'
import ReceptionDashboard from './pages/Reception/ReceptionDashboard'
import CheckOutManagement from './pages/Reception/CheckOutManagement'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
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
        <Route path="/reception/checkout" element={<CheckOutManagement />} />
      </Routes>
 </Router>
  )
}
export default App
