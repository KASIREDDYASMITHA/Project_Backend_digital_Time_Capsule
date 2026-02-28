require("dotenv").config();
require("./src/utils/cronjob");

const adminRoutes = require("./src/routes/adminRoutes");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const supabase = require("./src/config/supabase");

// Route imports (we will create these next)
const authRoutes = require("./src/routes/authRoutes");
const capsuleRoutes = require("./src/routes/capsuleRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");
const app = express();

// Middlewares
//app.use(cors()); replavced this with  next line one
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend port
    credentials: true,
  }),
);
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send("🚀 Digital Time Capsule Backend Running");
});

// API routes
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/capsules", capsuleRoutes);

//app.use("./src/api/admin", adminRoutes);//
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
// 404 Middleware
app.use(notFound);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test DB connection
    const { error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      console.error("❌ Database Connection Failed:", error.message);
    } else {
      console.log("✅ Database Connected Successfully");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server Startup Error:", err.message);
  }
};
app.get("/", (req, res) => {
  res.send("Digital Time Capsule Backend is Running 🚀");
});
startServer();
