const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("\nERROR: MONGO_URI is not set in Backend/.env");
    console.error("Please install MongoDB locally or use MongoDB Atlas.");
    console.error("Example Atlas URI:");
    console.error("MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/hospital_management?retryWrites=true&w=majority\n");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
