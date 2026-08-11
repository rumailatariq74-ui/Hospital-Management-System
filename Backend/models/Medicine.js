const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    supplier: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", MedicineSchema);
