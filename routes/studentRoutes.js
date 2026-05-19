// routes/student.routes.js

import express from "express";

import * as studentController from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// =====================================================
// SUBSCRIPTION
// =====================================================

router.post(
  "/subscription",protect,
  studentController.createSubscription
);

router.get(
  "/subscription",protect,
  studentController.getAllSubscriptions
);

router.put(
  "/subscription/:id",protect,
  studentController.updateSubscription
);

// =====================================================
// ASSIGNMENT
// =====================================================

router.post(
  "/assignment",protect,
  studentController.createAssignment
);

router.get(
  "/assignment",protect,
  studentController.getAllAssignments
);

router.put(
  "/assignment/:id",protect,
  studentController.updateAssignment
);

// =====================================================
// STUDENT ANSWERS
// =====================================================

router.post(
  "/assignment/submit",protect,
  studentController.submitAssignmentAnswers
);

router.get(
  "/assignment/results",protect,
  studentController.getStudentResults
);

router.post(
  "/assignmentQuestion",
  studentController.createAssignmentQuestions
);

// =====================================================
// GET ALL
// =====================================================

router.get(
  "/assignmentQuestions",
  studentController.getAllAssignmentQuestions
);

// =====================================================
// GET BY ID
// =====================================================

router.get(
  "/assignmentQuestion/:id",
  studentController.getAssignmentQuestionById
);

// =====================================================
// UPDATE
// =====================================================

router.put(
  "/assignmentQuestion/:id",
  studentController.updateAssignmentQuestion
);

// =====================================================
// DELETE
// =====================================================

router.delete(
  "/assignmentQuestion/:id",
  studentController.deleteAssignmentQuestion
);

export default router;