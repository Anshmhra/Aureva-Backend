import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  // ✅ Accept ANY user
  return res.status(200).json({
    token: "dummy-token-123",
    email: email,
  });
});