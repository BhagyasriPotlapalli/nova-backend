import express from "express";
import * as courseController from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register",protect, courseController.createMaster);
router.get("/allCategories",protect, courseController.getAllCategories);
router.put("/master/:type/:id", courseController.updateMaster);

router.get("/masters", courseController.getAllMasters);


router.get("/master/:type/:id", courseController.getMasterById);


export default router;