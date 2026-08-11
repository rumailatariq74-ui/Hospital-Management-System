const mongoose = require("mongoose");

const BloodBankSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    units: { type: Number, default: 1 },
    date: { type: Date, default: Date.now },
    contact: { type: String, required: true },
    status: {
      type: String,
      enum: ["Available", "Used", "Expired"],
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodBank", BloodBankSchema);
