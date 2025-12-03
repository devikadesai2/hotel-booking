const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

// Create a booking (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const { hotel, from, to, guests } = req.body;
    if (!hotel || !from || !to) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    // 1️⃣ Find the hotel to get its price
    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc) return res.status(404).json({ message: 'Hotel not found' });

    // 2️⃣ Calculate number of nights
    const checkIn = new Date(from);
    const checkOut = new Date(to);
    const diffMs = checkOut - checkIn;
    const nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    // 3️⃣ Calculate total price
    const totalPrice = nights * hotelDoc.pricePerNight;

    // 4️⃣ Save booking
    const booking = new Booking({
      user: req.user.id,
      hotel,
      from: checkIn,
      to: checkOut,
      guests: guests || 1,
      totalPrice,
    });
    await booking.save();

    // 5️⃣ Send result
    res.status(201).json({
      message: 'Booking successful',
      booking,
      nights,
      totalPrice,
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings for current user (authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('hotel');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
