const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/lab-tests", require("./routes/labTestRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/blood-bank", require("./routes/bloodBankRoutes"));
app.use("/api/ambulances", require("./routes/ambulanceRoutes"));
app.use("/api/emergency", require("./routes/emergencyRoutes"));
app.use("/api/surgeries", require("./routes/surgeryRoutes"));
app.use("/api/equipment", require("./routes/equipmentRoutes"));
app.use("/api/visitors", require("./routes/visitorRoutes"));
app.use("/api/notices", require("./routes/noticeRoutes"));
app.use("/api/settings", require("./routes/hospitalSettingsRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Hospital Management System Backend is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
