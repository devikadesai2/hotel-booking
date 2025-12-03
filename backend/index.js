// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow frontend on Vite dev server
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Debug log
app.use((req, res, next) => {
  console.log("[REQ]", req.method, req.originalUrl);
  next();
});

// Mongo connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI not set in environment");
  // process.exit(1);  // don't exit on Render
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    // process.exit(1);  // comment this too for now
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

// generic 404 for API
app.use("/api", (req, res) =>
  res.status(404).json({ msg: "API endpoint not found" })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
