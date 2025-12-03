import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function HotelPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    api.get(`/hotels/${id}`).then(res => setHotel(res.data)).catch(console.error);
  }, [id]);

  const handleBook = async () => {
    if (!from || !to) { 
      alert('Please select check-in and check-out dates'); 
      return; 
    }
    try {
      // 👇 Your payload goes here
      const payload = { hotel: id, from, to, guests };

      const res = await api.post('/bookings', payload);
      alert(`✅ Booking successful! Total: ₹${res.data.totalPrice}`);
      console.log('Booking response:', res.data);
    } catch (err) {
      console.error('Booking failed:', err);
      alert('❌ Booking failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!hotel) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">{hotel.title}</h2>
      <p className="text-gray-600">{hotel.address}</p>
      <p className="mt-3">{hotel.description}</p>
      <p className="mt-2 font-semibold">₹{hotel.pricePerNight} / night</p>

      <div className="mt-6 border p-4 rounded-md max-w-sm">
        <label>Check-in</label>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border p-2 w-full mb-3" />

        <label>Check-out</label>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border p-2 w-full mb-3" />

        <label>Guests</label>
        <input type="number" min="1" value={guests} onChange={e => setGuests(Number(e.target.value))} className="border p-2 w-full mb-3" />

        <button onClick={handleBook} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Book Now
        </button>
      </div>
    </div>
  );
}
