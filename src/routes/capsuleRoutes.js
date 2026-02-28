const express = require("express");
const router = express.Router();

const {
  createCapsule,
  getUserCapsules,
  getSingleCapsule,
  getPublicCapsule, // for url
  updateCapsule,
  deleteCapsule,
} = require("../controllers/capsuleController");
// ============================
// PUBLIC VIEW ROUTE (NO AUTH)
// ============================

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // ✅ ADD THIS

// ============================
// CREATE CAPSULE
// ============================

// ✅ NEW (WITH FILE UPLOAD SUPPORT)
router.post("/", authMiddleware, upload.array("media"), createCapsule);

// ============================
// GET USER CAPSULES
// ============================
router.get("/", authMiddleware, getUserCapsules);

// ============================
// GET SINGLE CAPSULE
// ============================
router.get("/:id", authMiddleware, getSingleCapsule);

// ============================
// UPDATE CAPSULE
// ============================
router.put("/:id", authMiddleware, updateCapsule);

// ============================
// DELETE CAPSULE
// ============================
router.delete("/:id", authMiddleware, deleteCapsule);

module.exports = router;
