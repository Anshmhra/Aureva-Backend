import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // dummy check (test ke liye)
  if (email === "test@test.com" && password === "123456") {
    return res.json({
      token: "dummy-token-123"
    });
  }

  res.status(400).json({ message: "Invalid credentials" });
});

export default router;