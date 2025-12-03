// backend/routes/bookings.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const auth = require("../middleware/auth");
const adminCheck = require("../middleware/adminCheck");

// POST /api/bookings  (user creates booking)
router.post("/", auth, async (req, res) => {
  try {
    const { hotel: hotelId, from, to, guests } = req.body;
    if (!hotelId || !from || !to || !guests) {
      return res.status(400).json({ msg: "Missing booking fields" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ msg: "Hotel not found" });

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const days =
      Math.max(
        1,
        Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24))
      );
    const total = days * hotel.price * Number(guests || 1);

    const booking = await Booking.create({
      user: req.user.id,
      hotel: hotelId,
      from: fromDate,
      to: toDate,
      total,
      guests,
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error("[BOOKING CREATE] error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/bookings/my  (user's own bookings)
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("hotel")
      .sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    console.error("[BOOKING MY] error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/bookings  (admin – all bookings)
router.get("/", auth, adminCheck, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("hotel")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    console.error("[BOOKING LIST] error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// DELETE /api/bookings/:id  (owner or admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    const requesterId = String(req.user.id);
    const ownerId = String(booking.user);
    const isAdmin = String(req.user.role) === "admin";

    if (!isAdmin && requesterId !== ownerId) {
      console.warn("[BOOKING DELETE] Not authorized:", requesterId);
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this booking" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    console.log("[BOOKING DELETE] deleted:", req.params.id);
    return res.json({ msg: "Booking deleted" });
  } catch (err) {
    console.error("[BOOKING DELETE] error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
