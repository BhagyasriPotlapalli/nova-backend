import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {catchAsync} from "../utils/catchAsync.js";
const User = db.User;
import { Op } from "sequelize";
// 🔐 Generate Token (90 days)
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "90d" }
  );
};

// ✅ Register
export const register = async (req, res) => {
  try {
    const { password, email } = req.body;

    const exists = await User.findOne({ where: { email } });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔴 Check verification
    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
     role:user.role,
     email:user.email,
      token: `Bearer ${token}`,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🔑 Change Password (protected)
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.updatedBy = req.user.id;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🔄 Forgot Password (basic version)
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Verify User (manual/simple)
export const verifyUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: "User verified successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// ======================================================
// GET USER BY ID
// ======================================================

export const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
      isDeleted: false,
    },

    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  // ======================================================
  // CHECK USER
  // ======================================================

  const user = await User.findOne({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // ======================================================
  // EMAIL CHECK
  // ======================================================

  if (req.body.email) {
    const existingEmail = await User.findOne({
      where: {
        email: req.body.email,
        id: {
          [Op.ne]: id,
        },
      },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
  }

  // ======================================================
  // UPDATE ONLY SENT FIELDS
  // ======================================================

  const updatedData = {
    ...req.body,
    updatedBy: req.user?.id || null,
  };

  await user.update(updatedData);

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});