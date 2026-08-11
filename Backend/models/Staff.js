const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    phone: { type: String, required: true },
    shift: { type: String, required: true },
    salary: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", StaffSchema);
