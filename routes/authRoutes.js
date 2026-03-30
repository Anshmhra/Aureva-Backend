router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // koi bhi login allow
  if (email && password) {
    return res.json({
      token: "dummy-token-123",
      email: email
    });
  }

  res.status(400).json({ message: "Enter details" });
});