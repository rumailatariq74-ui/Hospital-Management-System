const mongoose = require("mongoose");

const HospitalSettingsSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    currency: { type: String, default: "USD" },
    theme: { type: String, default: "light" },
    notifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HospitalSettings", HospitalSettingsSchema);
