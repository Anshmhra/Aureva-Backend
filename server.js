import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";

// 🔥 Load env variables (TOP pe hi best hota hai)
dotenv.config();

const app = express();

// 🔥 Middleware
app.use(cors());
app.use(express.json());

// 🔥 MongoDB connect
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected 🔥");
  } catch (err) {
    console.log("❌ MongoDB Error:", err);
    process.exit(1);
  }
};

connectDB();

// 🔥 Routes
app.use("/api/auth", authRoutes);

// 🔥 Test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// 🔥 Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});