const express = require("express");
const router = express.Router();

// ✅ FIXED IMPORT
const protect = require("../middleware/authMiddleware");

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected profile data",
    userId: req.user.id,
  });
});

module.exports = router;
