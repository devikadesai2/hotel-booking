const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  title: String,
  address: String,
  description: String,
  pricePerNight: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', hotelSchema);
