const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
    purpose: { type: String, default: "" },
    entryTime: { type: Date, default: Date.now },
    exitTime: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", VisitorSchema);
