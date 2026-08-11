const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    location: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    lastService: { type: Date, default: Date.now },
    nextService: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Under Maintenance", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", EquipmentSchema);
