// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allow both Localhost (dev) + Vercel (prod)
const allowedOrigins = [
  "http://localhost:5173",
  "https://hotel-booking-fawn-pi.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Debug log middleware
app.use((req, res, next) => {
  console.log("[REQ]", req.method, req.originalUrl);
  next();
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI not set in Render Environment Variables");
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Routes
const authRouter = require("./routes/auth");
const hotelsRouter = require("./routes/hotels");
const bookingsRouter = require("./routes/bookings");

app.use("/api/auth", authRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/bookings", hotelsRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

// 404 handler for API routes
app.use("/api", (req, res) =>
  res.status(404).json({ msg: "API endpoint not found" })
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ Export for serverless environments (Vercel/Cloud if needed)
module.exports = app;
