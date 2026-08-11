const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    beds: { type: Number, default: 1 },
    occupied: { type: Number, default: 0 },
    floor: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);
