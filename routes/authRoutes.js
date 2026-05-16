import express from "express";
import Razorpay from "razorpay";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const router = express.Router();


// =====================
// ✅ SIGNUP ROUTE
// =====================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Signup Data:", req.body);

    // 🔍 VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields (name, email, password) are required",
      });
    }

    // 🔍 CHECK EXISTING USER
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 CREATE USER
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 💾 SAVE USER
    await user.save();

    console.log("✅ USER SAVED:", user);

    // 🔑 GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ✅ RESPONSE
    res.status(201).json({
      message: "Signup successful 🔥",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.log("❌ Signup Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =====================
// ✅ LOGIN ROUTE
// =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // 🔍 FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // 🔐 CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    // 🔑 GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ✅ RESPONSE
    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.log("❌ Login Error:", err);

    res.status(500).json({
      message: "Login failed",
    });
  }
});


// =====================
// 💳 CREATE ORDER ROUTE
// =====================
router.post("/create-order", async (req, res) => {
  try {

    // ✅ RAZORPAY INSTANCE
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // ✅ GET DATA
    const { amount, items = [] } = req.body;

    // ✅ DEBUG LOGS
    console.log("REQ BODY:", req.body);
    console.log("FRONTEND AMOUNT:", amount);
    console.log("TYPE:", typeof amount);

    // 🔍 VALIDATION
    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        message: "Valid amount is required",
      });
    }

    // 💰 CONVERT ₹ → PAISE
    const amountInPaise = Math.round(Number(amount) * 100);

    console.log("PAISE:", amountInPaise);

    // ✅ RAZORPAY OPTIONS
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: "order_" + Date.now(),
      notes: {
        item_count: `${items.length}`,
      },
    };

    console.log("RAZORPAY OPTIONS:", options);

    // ✅ CREATE ORDER
    const order = await razorpay.orders.create(options);

    console.log("✅ ORDER CREATED:", order);

    // ✅ RESPONSE
    res.status(200).json(order);

  } catch (error) {

    console.log("❌ RAZORPAY ERROR:", error);

    res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
});

export default router;