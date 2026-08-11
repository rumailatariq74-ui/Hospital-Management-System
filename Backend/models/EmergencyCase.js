const mongoose = require("mongoose");

const EmergencyCaseSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    condition: { type: String, required: true },
    priority: { type: String, required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    vitals: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Admitted", "In-Progress", "Discharged"],
      default: "In-Progress",
    },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmergencyCase", EmergencyCaseSchema);
