const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const { sendUnlockEmail } = require("../utils/emailService");
const jwt = require("jsonwebtoken");
const adminAuth = require("../middleware/adminAuth");
const bcrypt = require("bcryptjs");

// =============================
// ADMIN LOGIN
// =============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: admin, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !admin) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" },
  );

  res.json({
    message: "Login successful",
    token,
  });
});

// =============================
// GET ALL CAPSULES
// =============================
router.get("/capsules", adminAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("capsules")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    total: data.length,
    capsules: data,
  });
});

// =============================
// GET LOCKED CAPSULES
// =============================

router.get("/capsules/locked", adminAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("capsules")
    .select("*")
    .eq("is_locked", true);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// =============================
// GET UNLOCKED CAPSULES
// =============================
router.get("/capsules/unlocked", adminAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("capsules")
    .select("*")
    .eq("is_locked", false);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// =============================
// GET EMAIL LOGS
// =============================
router.get("/email-logs", adminAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("email_logs")
    .select("*")
    .order("sent_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// =============================
// RETRY FAILED EMAILS
// =============================
router.post("/email-logs/retry", adminAuth, async (req, res) => {
  const { data: failedLogs, error } = await supabase
    .from("email_logs")
    .select("*")
    .eq("status", "failed");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!failedLogs || failedLogs.length === 0) {
    return res.json({ message: "No failed emails to retry." });
  }

  for (let log of failedLogs) {
    try {
      await sendUnlockEmail(
        log.recipient_email,
        "Retry: Your Time Capsule is Unlocked",
      );

      await supabase
        .from("email_logs")
        .update({ status: "success", error_message: null })
        .eq("id", log.id);
    } catch (err) {
      console.log("Retry failed:", err.message);
    }
  }

  res.json({ message: "Retry process completed." });
});

module.exports = router;
