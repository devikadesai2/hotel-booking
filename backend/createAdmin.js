// createAdmin.js (run manually to create/update admin)
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const mongo =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hotel_booking";

// default admin creds (can override via CLI)
const ADMIN_EMAIL = process.argv[2] || "admin@gmail.com";
const ADMIN_PW = process.argv[3] || "Admin@123";

(async () => {
  try {
    await mongoose.connect(mongo);
    console.log("Connected to MongoDB");

    let user = await User.findOne({ email: ADMIN_EMAIL });

    const hash = await bcrypt.hash(ADMIN_PW, 10);

    if (user) {
      console.log("Admin email already exists, updating password & role.");
      user.password = hash;
      user.role = "admin";
      await user.save();
    } else {
      user = new User({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: hash,
        role: "admin",
      });
      await user.save();
      console.log("Admin user created.");
    }

    console.log("\nLogin with:");
    console.log("  Email   :", ADMIN_EMAIL);
    console.log("  Password:", ADMIN_PW, "\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
})();
