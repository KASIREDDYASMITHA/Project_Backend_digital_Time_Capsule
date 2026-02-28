const supabase = require("../config/supabase");
const fs = require("fs");

// ============================
// CREATE CAPSULE
// ============================
exports.createCapsule = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      unlockDate,
      unlock_date,
      theme,
      is_public,
      send_email,
    } = req.body;

    const finalUnlockDate = unlockDate || unlock_date;

    if (!finalUnlockDate) {
      return res.status(400).json({
        message: "Unlock date is required",
      });
    }

    if (new Date(finalUnlockDate) <= new Date()) {
      return res.status(400).json({
        message: "Unlock date must be in the future",
      });
    }

    let mediaUrls = [];

    // ✅ SAFE FILE UPLOAD HANDLING (FIXED FOR VIDEO)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `${Date.now()}-${file.originalname}`;

        let fileData;

        // ✅ If using memoryStorage
        if (file.buffer) {
          fileData = file.buffer;
        }

        // ✅ If using diskStorage
        else if (file.path) {
          fileData = fs.readFileSync(file.path);
        }

        const { error: uploadError } = await supabase.storage
          .from("capsule-media")
          .upload(fileName, fileData, {
            contentType: file.mimetype,
          });

        if (uploadError) {
          console.error("SUPABASE UPLOAD ERROR:", uploadError);
          throw uploadError;
        }

        const { data: publicUrl } = supabase.storage
          .from("capsule-media")
          .getPublicUrl(fileName);

        mediaUrls.push(publicUrl.publicUrl);

        // ✅ Delete temp file if diskStorage
        if (file.path) {
          fs.unlinkSync(file.path);
        }
      }
    }

    const { data, error } = await supabase
      .from("capsules")
      .insert([
        {
          user_id: req.user.id,
          title,
          description,
          content,
          unlock_date: finalUnlockDate,
          theme,
          is_locked: true,
          is_public: is_public === "true",
          send_email_reminder: send_email === "true",
          media_urls: mediaUrls,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      throw error;
    }

    res.status(201).json({
      message: "Capsule created successfully",
      capsule: data,
    });
  } catch (error) {
    console.error("CREATE CAPSULE ERROR FULL:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createCapsule = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      unlock_date,
      theme,
      is_public,
      send_email,
      country,
      state,
    } = req.body;

    if (!unlock_date) {
      return res.status(400).json({
        message: "Unlock date is required",
      });
    }

    const finalUnlockDate = new Date(unlock_date);

    if (finalUnlockDate <= new Date()) {
      return res.status(400).json({
        message: "Unlock date must be in the future",
      });
    }

    let mediaUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `${Date.now()}-${file.originalname}`;
        let fileData;

        if (file.buffer) fileData = file.buffer;
        else if (file.path) fileData = fs.readFileSync(file.path);

        const { error: uploadError } = await supabase.storage
          .from("capsule-media")
          .upload(fileName, fileData, {
            contentType: file.mimetype,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("capsule-media")
          .getPublicUrl(fileName);

        mediaUrls.push(publicUrl.publicUrl);

        if (file.path) fs.unlinkSync(file.path);
      }
    }

    const { data, error } = await supabase
      .from("capsules")
      .insert([
        {
          user_id: req.user.id,
          title,
          description,
          content,
          unlock_date: finalUnlockDate.toISOString(),
          country,
          state,
          theme,
          is_locked: true,
          is_public: is_public === "true",
          send_email_reminder: send_email === "true",
          media_urls: mediaUrls,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Capsule created successfully",
      capsule: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ============================
// GET USER CAPSULES
// ============================
exports.getUserCapsules = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("capsules")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const now = new Date();

    const updatedCapsules = data.map((capsule) => {
      const unlockDate = new Date(capsule.unlock_date);
      const createdDate = new Date(capsule.created_at);

      const totalDuration = unlockDate - createdDate;
      const elapsed = now - createdDate;

      const progress =
        totalDuration > 0
          ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
          : 100;

      const isUnlocked = unlockDate <= now;

      const timeRemaining = isUnlocked ? 0 : Math.max(0, unlockDate - now);

      return {
        ...capsule,
        is_locked: !isUnlocked,
        progress: Math.floor(progress),
        time_remaining: timeRemaining,
      };
    });

    res.status(200).json({ capsules: updatedCapsules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GET SINGLE CAPSULE
// ============================
exports.getSingleCapsule = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("capsules")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Capsule not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// UPDATE CAPSULE
// ============================
exports.updateCapsule = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("capsules")
      .update(req.body)
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: "Capsule updated successfully",
      capsule: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// DELETE CAPSULE
// ============================
exports.deleteCapsule = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("capsules")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.status(200).json({
      message: "Capsule deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CAPSULE ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};
