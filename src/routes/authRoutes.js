const express = require("express");
const router = express.Router();
const { getProfile, changePassword } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/change-password", protect, changePassword);
//console.log("✅ authRoutes loaded");
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

module.exports = router;
