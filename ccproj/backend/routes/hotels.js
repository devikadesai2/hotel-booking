// routes/hotel.js
const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const auth = require('../middleware/auth');

// Create hotel (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const hotel = new Hotel({ ...req.body, createdBy: req.user.id });
    await hotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all hotels (optionally search by q)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q ? { $or: [{ title: new RegExp(q, 'i') }, { address: new RegExp(q, 'i') }] } : {};
    const hotels = await Hotel.find(filter).sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single hotel by id
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update hotel (authenticated, optionally only owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    // Optional: allow only creator to update
    if (hotel.createdBy && hotel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(hotel, req.body);
    await hotel.save();
    res.json(hotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete hotel (authenticated, optionally only owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    // Optional: allow only creator to delete
    if (hotel.createdBy && hotel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
