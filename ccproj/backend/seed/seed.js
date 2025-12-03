require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for seeding');
  await Hotel.deleteMany({}); await User.deleteMany({});
  const passwordHash = await bcrypt.hash('pass1234', 10);
  const user = new User({ name: 'Seed Admin', email: 'admin@seed.com', passwordHash });
  await user.save();
  const hotels = [
    { title: 'Sunrise Resort', address: 'Goa, India', description: 'Beautiful beachside resort', pricePerNight: 4000, maxGuests: 4, photos: [] , createdBy: user._id },
    { title: 'Grand Palace', address: 'Jaipur, India', description: 'Heritage hotel', pricePerNight: 5500, maxGuests: 2, photos: [], createdBy: user._id },
    { title: 'Hill View Inn', address: 'Ooty, India', description: 'Hillside cozy inn', pricePerNight: 3000, maxGuests: 3, photos: [], createdBy: user._id }
  ];
  await Hotel.insertMany(hotels);
  console.log('Seeded hotels and user. Admin login: admin@seed.com / pass1234');
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
