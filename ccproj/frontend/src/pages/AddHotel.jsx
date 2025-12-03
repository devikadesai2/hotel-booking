import React, { useState, useContext } from 'react';
import api from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddHotel() {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');

  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIXED: post to /hotels/add instead of /hotels
      await api.post('/hotels/add', {
        title,
        address,
        description: desc,
        pricePerNight: Number(price),
      });
      alert('Hotel added successfully!');
      nav('/my-hotels');
    } catch (err) {
      console.error('Add hotel error:', err);
      alert(err.response?.data?.message || 'Error adding hotel');
    }
  };

  if (!user) return <div>Please login to add hotels</div>;

  return (
    <form onSubmit={submit} className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Hotel</h2>
      <input
        className="w-full p-2 mb-2 border"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="w-full p-2 mb-2 border"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <textarea
        className="w-full p-2 mb-2 border"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        required
      />
      <input
        className="w-full p-2 mb-2 border"
        placeholder="Price per night"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        type="submit"
      >
        Add Hotel
      </button>
    </form>
  );
}
