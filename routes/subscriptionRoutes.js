import express from "express";

import * as subscriptionController from "../controllers/subscriptionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// =====================================================
// PLAN ROUTES
// =====================================================

router.post(
  "/plan",
  protect,
  subscriptionController.createPlan
);

router.put(
  "/plan/:id",
  protect,
  subscriptionController.updatePlan
);

router.get(
  "/plans",
  subscriptionController.getPlans
);

router.get(
  "/plan/:id",
  subscriptionController.getSinglePlan
);

router.delete(
  "/plan/:id",
  protect,
  subscriptionController.deletePlan
);


// =====================================================
// PAYMENT ROUTES
// =====================================================

router.post(
  "/create-order",
  protect,
  subscriptionController.createOrder
);

router.post(
  "/verify-payment",
  protect,
  subscriptionController.verifyPayment
);


// =====================================================
// SUBSCRIPTION ROUTES
// =====================================================

router.get(
  "/subscriptions",
  protect,
  subscriptionController.getSubscriptions
);

router.get(
  "/subscription/:id",
  protect,
  subscriptionController.getSingleSubscription
);

router.put(
  "/subscription/:id",
  protect,
  subscriptionController.updateSubscription
);

router.get(
  "/my-subscription",
  protect,
  subscriptionController.getMySubscription
);

router.post(
  "/check-access",
  protect,
  subscriptionController.checkCourseAccess
);


// =====================================================
// SWITCH PLAN ROUTES
// =====================================================

router.post(
  "/switch-plan-order",
  protect,
 subscriptionController.switchPlanOrder
);

router.post(
  "/verify-switch-payment",
  protect,
  subscriptionController.verifySwitchPayment
);


// =====================================================
// PAYMENT HISTORY
// =====================================================

router.get(
  "/payments",
  protect,
  subscriptionController.getPayments
);

router.get(
  "/payment/:id",
  protect,
  subscriptionController.getSinglePayment
);

export default router;