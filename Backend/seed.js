require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

connectDB();

const seed = async () => {
  try {
    const existing = await User.findOne({ username: "admin" });

    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);
      await User.create({ username: "admin", password: hashed, role: "admin" });
      console.log("Default admin user created: admin / admin123");
    } else {
      console.log("Admin user already exists");
    }

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seed();
