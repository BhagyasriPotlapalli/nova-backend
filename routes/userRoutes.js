import express from "express";
import {
  register,
  login,
  changePassword,
  forgotPassword,
  verifyUser,
  getUserById,
  updateUser,
  getDashboardStatus,
  confirmForgotPassword,
  getUsers
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/confirm-forgot-password", confirmForgotPassword);
router.post("/verify", verifyUser);

// Protected route
router.post("/change-password", protect, changePassword);

router.get("/dashBorad",protect, getDashboardStatus);
router.get("/users", getUsers);
router.get("/user/:id", getUserById);


router.put("/edit/:id", updateUser);

export default router;