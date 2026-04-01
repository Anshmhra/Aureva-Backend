import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

// ✅ SIGNUP ROUTE
router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  return res.status(200).json({ message: "Signup successful" });
});

// ✅ LOGIN ROUTE
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  return res.status(200).json({
    token: "dummy-token-123",
    email: email,
  });
});

// 💳 CREATE ORDER ROUTE
router.post("/create-order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, items = [] } = req.body;

    // 🔍 DEBUG - terminal mein dekho kya aa raha hai
    console.log("📦 Received amount from frontend:", amount);
    console.log("📦 Items received:", JSON.stringify(items, null, 2));

    // ✅ Amount already rupees mein hai frontend se
    // Backend ×100 karta hai → paise mein convert
    const amountInPaise = Math.round(Number(amount) * 100);
    console.log("💰 Amount in paise being sent to Razorpay:", amountInPaise);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: "order_" + Date.now(),
      notes: {
        item_count: `${items.length} item(s)`,
        order_summary: items
          .map(i => `${i.title} ×${i.quantity}`)
          .join(", "),
        total: `₹${amount}`,
      },
    };

    const order = await razorpay.orders.create(options);

    // 🔍 DEBUG - Razorpay se kya wapas aaya
    console.log("✅ Razorpay order created:", {
      id: order.id,
      amount: order.amount,       // paise mein hoga
      amount_rupees: order.amount / 100,  // rupees mein
    });

    res.json(order);
  } catch (error) {
    console.log("❌ ERROR creating order:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

export default router;