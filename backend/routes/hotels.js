// backend/routes/hotels.js
const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const auth = require("../middleware/auth");
const adminCheck = require("../middleware/adminCheck");

// GET /api/hotels?q=search
router.get("/", async (req, res) => {
  try {
    const q = req.query.q;
    let filter = {};
    if (q) {
      const regex = new RegExp(q, "i");
      filter = {
        $or: [
          { name: regex },
          { city: regex },
          { description: regex },
        ],
      };
    }
    const hotels = await Hotel.find(filter).sort({ createdAt: -1 });
    return res.json(hotels);
  } catch (err) {
    console.error("[HOTELS GET] error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// POST /api/hotels (admin)
router.post("/", auth, adminCheck, async (req, res) => {
  try {
    const { name, city, description, price, images } = req.body;
    if (!name || !city || !price) {
      return res
        .status(400)
        .json({ msg: "Name, city and price are required" });
    }

    const hotel = await Hotel.create({
      name,
      city,
      description,
      price,
      images: images || [],
      createdBy: req.user.id,
    });

    return res.status(201).json(hotel);
  } catch (err) {
    console.error("[HOTEL CREATE] error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// PUT /api/hotels/:id (admin)
router.put("/:id", auth, adminCheck, async (req, res) => {
  try {
    const { name, city, description, price, images } = req.body;
    const update = { name, city, description, price, images };
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!hotel) return res.status(404).json({ msg: "Hotel not found" });
    return res.json(hotel);
  } catch (err) {
    console.error("[HOTEL UPDATE] error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// DELETE /api/hotels/:id (admin)
router.delete("/:id", auth, adminCheck, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ msg: "Hotel not found" });

    await Hotel.findByIdAndDelete(req.params.id);
    console.log("[HOTEL DELETE] deleted:", req.params.id);
    return res.json({ msg: "Hotel deleted" });
  } catch (err) {
    console.error("[HOTEL DELETE] error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
