import React, { useEffect, useState, useContext } from 'react';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MyHotels() {
  const { user } = useContext(AuthContext);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        let res;
        // If user logged in, try fetching their own hotels
        if (user && user.id) {
          res = await api.get('/hotels/my');
        } else {
          // fallback: show all hotels
          res = await api.get('/hotels');
        }
        const data = res?.data;
        if (Array.isArray(data)) setHotels(data);
        else if (data && Array.isArray(data.hotels)) setHotels(data.hotels);
        else setHotels([]);
      } catch (err) {
        console.error('Failed to load hotels:', err);
        // fallback to public list if /my fails
        try {
          const fallback = await api.get('/hotels');
          setHotels(Array.isArray(fallback.data) ? fallback.data : []);
        } catch (e2) {
          setError('Could not load hotels');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [user]);

  if (loading) return <div className="p-4">Loading hotels...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Hotels</h2>
      {hotels.length === 0 ? (
        <p className="text-gray-600">No hotels found. Try adding one.</p>
      ) : (
        <div className="grid gap-4">
          {hotels.map(hotel => (
            <div key={hotel._id} className="border p-4 rounded bg-white shadow-sm">
              <div className="flex justify-between">
                <div>
                  <Link to={`/hotels/${hotel._id}`} className="text-xl font-semibold hover:underline">
                    {hotel.title}
                  </Link>
                  <p className="text-gray-500">{hotel.address}</p>
                </div>
                <p className="font-bold text-blue-700">₹{hotel.pricePerNight}</p>
              </div>
              <p className="mt-2 text-gray-700">{hotel.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
