import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import RoomsPage from './pages/RoomsPage'
import BookingPage from './pages/BookingPage'
import GuestInfoPage from './pages/GuestInfoPage'
import PaymentPage from './pages/PaymentPage'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/guest-info" element={<GuestInfoPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  )
}
export default App
