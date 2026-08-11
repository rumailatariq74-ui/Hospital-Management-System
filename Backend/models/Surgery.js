const mongoose = require("mongoose");

const SurgerySchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    surgeon: { type: String, required: true },
    surgeryType: { type: String, required: true },
    otRoom: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    priority: { type: String, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "In-Progress", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Surgery", SurgerySchema);
