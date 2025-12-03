import React, { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import HotelPage from './pages/HotelPage';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import AddHotel from './pages/AddHotel';
import MyHotels from './pages/MyHotels';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">MernHolidays.com</Link>
        </div>
        <nav className="space-x-4">
          <Link to="/bookings">My Bookings</Link>
          <Link to="/my-hotels">My Hotels</Link>
          <Link to="/add-hotel">Add Hotel</Link>
          {user ? (
            <button
              onClick={logout}
              className="ml-4 bg-white text-blue-800 px-3 py-1 rounded"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="ml-4">
              Sign In
            </Link>
          )}
        </nav>
      </header>

      {/* Page Routes */}
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels/:id" element={<HotelPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/add-hotel" element={<AddHotel />} />
          {/* ✅ Add this line for My Hotels page */}
          <Route path="/my-hotels" element={<MyHotels />} />
        </Routes>
      </main>
    </div>
  );
}
