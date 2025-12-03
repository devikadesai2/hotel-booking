// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allow both Localhost (dev) + Vercel (prod)
const allowedOrigins = [
  "http://localhost:5173",
  "https://hotel-booking-fawn-pi.vercel.app",  // <-- your real Vercel domain
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

// Debug log
app.use((req, res, next) => {
  console.log("[REQ]", req.method, req.originalUrl);
  next();
});

// Mongo connection (Render won't crash even if DB fails)
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
app.use("/api/bookings", bookingsRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

// 404 handler
app.use("/api", (req, res) =>
  res.status(404).json({ msg: "API endpoint not found" })
);

// ✅ Render will assign its own internal port, but app runs on 5000 externally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
