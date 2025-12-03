// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const hotelRoutes = require('./routes/hotel');
const bookingRoutes = require('./routes/bookings');

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Mongo connection error:', err && err.message ? err.message : err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', require('./routes/hotel')); // ✅ mounts hotel routes
app.use('/api/bookings', bookingRoutes);

// optional: health check
app.get('/api/ping', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
