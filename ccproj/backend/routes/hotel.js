const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// ✅ Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    console.error('GET /hotels error:', err);
    res.status(500).json({ message: 'Server error loading hotels' });
  }
});

// ✅ Add a hotel (no login required)
router.post('/add', async (req, res) => {
  try {
    const { title, address, description, pricePerNight } = req.body;

    // auto-fill missing fields to prevent frontend validation errors
    const newHotel = new Hotel({
      title: title || 'Untitled Hotel',
      address: address || 'Unknown City',
      description: description || '',
      pricePerNight: Number(pricePerNight) || 1000
    });

    await newHotel.save();
    res.status(201).json({ message: 'Hotel added successfully', hotel: newHotel });
  } catch (err) {
    console.error('POST /hotels/add error:', err);
    res.status(500).json({ message: 'Server error adding hotel' });
  }
});

// ✅ View single hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: 'Error loading hotel' });
  }
});

module.exports = router;
