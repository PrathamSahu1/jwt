const express = require("express");
const authenticateUser = require("../middlewares/auth");

const router = express.Router();

// Example protected route
router.get("/dashboard", authenticateUser, (req, res) => {
  res.json({ message: `Welcome, user ID: ${req.user.id}` });
});

module.exports = router;