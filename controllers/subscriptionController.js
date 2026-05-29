import crypto from "crypto";
import db from "../models/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { razorpay } from "../utils/razorpayService.js";

const Plan = db.Plan;
const Course = db.Course;
const Subscription = db.Subscription;
const SubscriptionCourse = db.SubscriptionCourse;
const Payment = db.Payment;
const User = db.User;

/* =====================================================
   PLAN APIs
===================================================== */

// CREATE PLAN
export const createPlan = catchAsync(async (req, res) => {
  const existing = await Plan.findOne({ where: { slug: req.body.slug } });

  if (existing) {
    return res.status(400).json({ message: "Plan already exists" });
  }

  const plan = await Plan.create({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json({ success: true, data: plan });
});

// UPDATE PLAN
export const updatePlan = catchAsync(async (req, res) => {
  const plan = await Plan.findByPk(req.params.id);

  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }

  await plan.update({ ...req.body, updatedBy: req.user.id });

  res.json({ success: true, data: plan });
});

// GET ALL PLANS
export const getPlans = catchAsync(async (req, res) => {
  const data = await Plan.findAll({ where: { isDeleted: false } });

  res.json({ success: true, data });
});

// GET SINGLE PLAN
export const getSinglePlan = catchAsync(async (req, res) => {
  const data = await Plan.findByPk(req.params.id);

  if (!data) return res.status(404).json({ message: "Plan not found" });

  res.json({ success: true, data });
});

// DELETE PLAN (SOFT DELETE)
export const deletePlan = catchAsync(async (req, res) => {
  const plan = await Plan.findByPk(req.params.id);

  if (!plan) return res.status(404).json({ message: "Plan not found" });

  await plan.update({ isDeleted: true, updatedBy: req.user.id });

  res.json({ success: true, message: "Deleted" });
});

/* =====================================================
   RAZORPAY ORDER
===================================================== */

export const createOrder = catchAsync(async (req, res) => {
  const { planId, planType, selectedCourses = [] } = req.body;

  const plan = await Plan.findByPk(planId);

  if (!plan) return res.status(404).json({ message: "Plan not found" });

  const amount =
    planType === "YEARLY" ? plan.priceYearly : plan.priceMonthly;

  // validate courses
  if (!plan.isUnlimited) {
    if (selectedCourses.length > plan.courseLimit) {
      return res.status(400).json({ message: "Course limit exceeded" });
    }
  }

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  const subscription = await Subscription.create({
    userId: req.user.id,
    planId,
    planType,
    amount,
    razorpayOrderId: order.id,
    status: "PENDING",
  });

  await Payment.create({
    userId: req.user.id,
    subscriptionId: subscription.id,
    razorpayOrderId: order.id,
    amount,
    paymentStatus: "CREATED",
  });

  res.json({
    success: true,
    order,
    subscriptionId: subscription.id,
  });
});

/* =====================================================
   VERIFY PAYMENT
===================================================== */

export const verifyPayment = catchAsync(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    subscriptionId,
    selectedCourses = [],
  } = req.body;

  const userId = req.user.id;

  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const subscription = await Subscription.findOne({
    where: { id: subscriptionId, userId },
    include: [{ model: Plan, as: "plan" }],
  });

  if (!subscription) {
    return res.status(404).json({ message: "Subscription not found" });
  }

  const startDate = new Date();
  const endDate = new Date();

  if (subscription.planType === "YEARLY") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  await subscription.update({
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    status: "ACTIVE",
    startDate,
    endDate,
  });

  // if (!subscription.plan.isUnlimited) {
    for (const courseId of selectedCourses) {
      await SubscriptionCourse.create({
        subscriptionId,
        userId,
        courseId,
      });
    }
  // }

  await Payment.update(
    {
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: "SUCCESS",
    },
    { where: { subscriptionId } }
  );

  res.json({ success: true, message: "Payment verified" });
});

/* =====================================================
   SUBSCRIPTIONS (ADMIN APIs)
===================================================== */

// GET ALL SUBSCRIPTIONS
export const getSubscriptions = catchAsync(async (req, res) => {
  const data = await Subscription.findAll({
    include: [
      { model: Plan, as: "plan" },
      { model: User, as: "student" },
      { model: SubscriptionCourse, as: "subscriptionCourses" },
    ],
    order: [["id", "DESC"]],
  });

  res.json({ success: true, data });
});

// GET SINGLE SUBSCRIPTION
export const getSingleSubscription = catchAsync(async (req, res) => {
  const data = await Subscription.findByPk(req.params.id, {
    include: [
      { model: Plan, as: "plan" },
      { model: User, as: "student" },
      { model: SubscriptionCourse, as: "subscriptionCourses" },
    ],
  });

  if (!data) {
    return res.status(404).json({ message: "Subscription not found" });
  }

  res.json({ success: true, data });
});

// UPDATE SUBSCRIPTION
export const updateSubscription = catchAsync(async (req, res) => {
  const sub = await Subscription.findByPk(req.params.id);

  if (!sub) {
    return res.status(404).json({ message: "Subscription not found" });
  }

  await sub.update({
    ...req.body,
    updatedBy: req.user.id,
  });

  res.json({ success: true, data: sub });
});

/* =====================================================
   MY SUBSCRIPTION
===================================================== */

export const getMySubscription = catchAsync(async (req, res) => {
  const data = await Subscription.findOne({
    where: { userId: req.user.id, status: "ACTIVE" },
    include: [{ model: Plan, as: "plan" }],
  });

  res.json({ success: true, data });
});

/* =====================================================
   COURSE ACCESS CHECK
===================================================== */

export const checkCourseAccess = catchAsync(async (req, res) => {
  const { courseId } = req.body;

  const sub = await Subscription.findOne({
    where: { userId: req.user.id, status: "ACTIVE" },
    include: [
      { model: Plan, as: "plan" },
      { model: SubscriptionCourse, as: "subscriptionCourses" },
    ],
  });

  if (!sub) {
    return res.status(403).json({ hasAccess: false });
  }

  if (sub.plan.isUnlimited) {
    return res.json({ hasAccess: true });
  }

  const allowed = sub.subscriptionCourses.some(
    (c) => c.courseId == courseId
  );

  res.json({ hasAccess: allowed });
});

// =====================================================
// SWITCH PLAN ORDER
// =====================================================

export const switchPlanOrder =
  catchAsync(async (req, res) => {
    const {
      newPlanId,
      selectedCourses = [],
    } = req.body;

    const userId = req.user.id;

    // CURRENT SUBSCRIPTION

    const currentSubscription =
      await Subscription.findOne({
        where: {
          userId,
          status: "ACTIVE",
          isDeleted: false,
        },

        include: [
          {
            model: Plan,
            as: "plan",
          },
        ],
      });

    if (!currentSubscription) {
      return res.status(404).json({
        success: false,
        message:
          "No active subscription",
      });
    }

    // NEW PLAN

    const newPlan =
      await Plan.findOne({
        where: {
          id: newPlanId,
          isDeleted: false,
          isActive: true,
        },
      });

    if (!newPlan) {
      return res.status(404).json({
        success: false,
        message:
          "Plan not found",
      });
    }

    // SAME PLAN CHECK

    if (
      currentSubscription.planId ===
      newPlan.id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Already subscribed to this plan",
      });
    }

    // VALIDATE LIMIT

    if (!newPlan.isUnlimited) {
      if (
        selectedCourses.length >
        newPlan.courseLimit
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Course limit exceeded",
        });
      }
    }

    // CREATE ORDER

    const options = {
      amount: newPlan.price * 100,
      currency: "INR",
      receipt: `switch_${Date.now()}`,
    };

    const order =
      await razorpay.orders.create(options);

    // CREATE NEW SUBSCRIPTION

    const subscription =
      await Subscription.create({
        userId,
        planId: newPlan.id,
        razorpayOrderId: order.id,
        amount: newPlan.price,
        status: "PENDING",
      });

    // CREATE PAYMENT

    await Payment.create({
      userId,
      subscriptionId:
        subscription.id,
      razorpayOrderId: order.id,
      amount: newPlan.price,
      paymentStatus: "CREATED",
    });

    return res.status(200).json({
      success: true,
      order,
      subscriptionId:
        subscription.id,
    });
  });

// =====================================================
// VERIFY SWITCH PAYMENT
// =====================================================

export const verifySwitchPayment =
  catchAsync(async (req, res) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subscriptionId,
      selectedCourses = [],
    } = req.body;

    const userId = req.user.id;

    // VERIFY SIGNATURE

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_KEY_SECRET
        )
        .update(
          razorpay_order_id +
            "|" +
            razorpay_payment_id
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // FIND SUBSCRIPTION

    const subscription =
      await Subscription.findOne({
        where: {
          id: subscriptionId,
        },

        include: [
          {
            model: Plan,
            as: "plan",
          },
        ],
      });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message:
          "Subscription not found",
      });
    }

    // EXPIRE OLD SUBSCRIPTIONS

    await Subscription.update(
      {
        status: "EXPIRED",
      },
      {
        where: {
          userId,
          status: "ACTIVE",
        },
      }
    );

    // START DATE

    const startDate = new Date();

    // END DATE

    const endDate = new Date();

    endDate.setDate(
      endDate.getDate() +
        subscription.plan
          .durationInDays
    );

    // ACTIVATE NEW PLAN

    await subscription.update({
      razorpayPaymentId:
        razorpay_payment_id,

      razorpaySignature:
        razorpay_signature,

      status: "ACTIVE",

      startDate,

      endDate,
    });

    // SAVE COURSES

    if (
      !subscription.plan.isUnlimited
    ) {
      for (const courseId of selectedCourses) {
        await SubscriptionCourse.create({
          subscriptionId:
            subscription.id,

          userId,

          courseId,
        });
      }
    }

    // UPDATE PAYMENT

    await Payment.update(
      {
        razorpayPaymentId:
          razorpay_payment_id,

        paymentStatus: "SUCCESS",
      },
      {
        where: {
          subscriptionId:
            subscription.id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Plan switched successfully",
    });
  });

// =====================================================
// GET PAYMENTS
// =====================================================

export const getPayments =
  catchAsync(async (req, res) => {
    const response =
      await Payment.findAll({
        where: {
          isDeleted: false,
        },

        include: [
          {
            model: Subscription,
            as: "subscription",
          },
          {
            model: User,
            as: "student",
          },
        ],

        order: [["id", "DESC"]],
      });

    return res.status(200).json({
      success: true,
      results: response.length,
      data: response,
    });
  });

// =====================================================
// GET SINGLE PAYMENT
// =====================================================

export const getSinglePayment =
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const response =
      await Payment.findOne({
        where: {
          id,
          isDeleted: false,
        },

        include: [
          {
            model: Subscription,
            as: "subscription",
          },
          {
            model: User,
            as: "student",
          },
        ],
      });

    if (!response) {
      return res.status(404).json({
        success: false,
        message:
          "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: response,
    });
  });