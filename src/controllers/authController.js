const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const loginSchema = require("../validations/loginValidation");
// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🟢 REGISTER USER

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: uuidv4(),
          name,
          email,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(data.id),
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 🔵 LOGIN USER
exports.loginUser = async (req, res, next) => {
  try {
    // ✅ VALIDATE INPUT FIRST
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
// ============================
// GET USER PROFILE
// ============================
exports.getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// CHANGE PASSWORD
// ============================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", req.user.id);

    if (error) throw error;

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ============================
// UPDATE NAME
// ============================
exports.updateName = async (req, res) => {
  try {
    const { name } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({ name })
      .eq("id", req.user.id)
      .select("id, name, email")
      .single();

    if (error) throw error;

    res.status(200).json({
      message: "Name updated successfully",
      user: data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
