const mongoose = require("mongoose");

const AmbulanceSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, unique: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ["Available", "Busy", "Maintenance"],
      default: "Available",
    },
    lastServiceDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ambulance", AmbulanceSchema);
