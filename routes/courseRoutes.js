import express from "express";
import * as courseController from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js";
import multerWrapper from "../utils/multerFun.js";

const upload = multerWrapper();

const router = express.Router();
const uploadTopicFiles = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
  { name: "optionA_0", maxCount: 1 },
  { name: "optionB_0", maxCount: 1 },
  { name: "optionC_0", maxCount: 1 },
  { name: "optionD_0", maxCount: 1 },
]);

// Public routes
router.post("/register",protect,uploadTopicFiles, courseController.createMaster);
router.get("/allCategories",protect, courseController.getAllCategories);
router.get("/categories", courseController.getAllCategories);
router.put("/master/:type/:id", uploadTopicFiles,courseController.updateMaster);

router.get("/masters", courseController.getAllMasters);


router.get("/master/:type/:id", courseController.getMasterById);
router.delete("/softDelete", courseController.softDeleteMasters);


export default router;