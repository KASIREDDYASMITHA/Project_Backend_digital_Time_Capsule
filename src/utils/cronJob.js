const cron = require("node-cron");
const supabase = require("../config/supabase");
const { sendUnlockEmail } = require("./emailService");

cron.schedule("* * * * *", async () => {
  console.log("Checking for capsules to unlock...");

  const now = new Date().toISOString();

  const { data: capsules, error } = await supabase
    .from("capsules")
    .select("*")
    .lte("unlock_date", now)
    .eq("is_locked", true);

  if (error) {
    console.log("Error fetching capsules:", error.message);
    return;
  }

  if (!capsules || capsules.length === 0) {
    return;
  }

  for (let capsule of capsules) {
    try {
      await sendUnlockEmail(process.env.EMAIL_USER, capsule.title);

      await supabase
        .from("capsules")
        .update({ is_locked: false })
        .eq("id", capsule.id);

      await supabase.from("email_logs").insert({
        capsule_id: capsule.id,
        recipient_email: process.env.EMAIL_USER,
        subject: "🎉 Your Time Capsule is Unlocked!",
        status: "success",
      });

      console.log("Unlocked and emailed:", capsule.title);
    } catch (error) {
      await supabase.from("email_logs").insert({
        capsule_id: capsule.id,
        recipient_email: process.env.EMAIL_USER,
        subject: "🎉 Your Time Capsule is Unlocked!",
        status: "failed",
        error_message: error.message,
      });

      console.log("Email failed:", error.message);
    }
  }
});
