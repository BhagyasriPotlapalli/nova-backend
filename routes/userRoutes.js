import express from "express";
import {
  register,
  login,
  changePassword,
  forgotPassword,
  verifyUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify", verifyUser);

// Protected route
router.post("/change-password", protect, changePassword);

export default router;