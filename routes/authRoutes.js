import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

// ✅ LOGIN ROUTE
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  return res.status(200).json({
    token: "dummy-token-123",
    email: email,
  });
});

// 💳 CREATE ORDER ROUTE
router.post("/create-order", async (req, res) => {
  try {
    // ✅ Razorpay instance INSIDE route
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

export default router;