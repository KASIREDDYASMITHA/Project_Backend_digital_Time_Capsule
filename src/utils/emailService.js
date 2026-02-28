const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendUnlockEmail = async (toEmail, title) => {
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "🎉 Your Time Capsule is Unlocked!",
    text: `Good news! Your capsule titled "${title}" is now unlocked. Go check it out!`,
  });
};

module.exports = { sendUnlockEmail };
