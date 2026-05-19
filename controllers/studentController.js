// controllers/student.controller.js

import { catchAsync } from "../utils/catchAsync.js";
import { Op } from "sequelize";

import db from "../models/index.js";

const User = db.User;
const Course = db.Course;
const Topic = db.Topic;
const Question = db.Question;

const CourseSubscription = db.CourseSubscription;
const Assignment = db.Assignment;
const AssignmentQuestion = db.AssignmentQuestion;
const StudentAnswer = db.StudentAnswer;

// =====================================================
// CREATE SUBSCRIPTION
// =====================================================

export const createSubscription = catchAsync(async (req, res) => {

  const { courseId, userId, expireDate } = req.body;

  const existingSubscription = await CourseSubscription.findOne({
    where: {
      courseId,
      userId,
      isActive: true,
    },
  });

  if (existingSubscription) {
    return res.status(400).json({
      success: false,
      message: "Already subscribed",
    });
  }

  const response = await CourseSubscription.create({
    courseId,
    userId,
    expireDate,
  });

  return res.status(201).json({
    success: true,
    message: "Subscription created successfully",
    data: response,
  });

});

// =====================================================
// GET ALL SUBSCRIPTIONS
// =====================================================

export const getAllSubscriptions = catchAsync(async (req, res) => {

  const { userId, courseId } = req.query;

  let whereCondition = {
    isActive: true,
  };

  if (userId) {
    whereCondition.userId = userId;
  }

  if (courseId) {
    whereCondition.courseId = courseId;
  }

  const response = await CourseSubscription.findAll({

    where: whereCondition,

    include: [
      {
        model: User,
        as: "student",

        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
        ],
      },

      {
        model: Course,
        as: "course",

        attributes: [
          "id",
          "title",
          "thumbnail",
        ],
      },
    ],

    order: [["id", "DESC"]],

  });

  return res.status(200).json({
    success: true,
    count: response.length,
    data: response,
  });

});

// =====================================================
// UPDATE SUBSCRIPTION
// =====================================================

export const updateSubscription = catchAsync(async (req, res) => {

  const { id } = req.params;

  const subscription = await CourseSubscription.findByPk(id);

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: "Subscription not found",
    });
  }

  await subscription.update(req.body);

  return res.status(200).json({
    success: true,
    message: "Subscription updated successfully",
    data: subscription,
  });

});

// =====================================================
// CREATE ASSIGNMENT
// =====================================================

export const createAssignment = catchAsync(async (req, res) => {

  const {
    courseId,
    topicId,
    title,
    questionIds,
  } = req.body;

  const assignment = await Assignment.create({
    courseId,
    topicId,
    title,
    totalQuestions: questionIds?.length || 0,
  });

  // =====================================================
  // MAP QUESTIONS
  // =====================================================

  if (Array.isArray(questionIds) && questionIds.length > 0) {

    const formattedQuestions = questionIds.map((questionId) => ({
      assignmentId: assignment.id,
      questionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await AssignmentQuestion.bulkCreate(formattedQuestions);

    // =====================================================
    // CALCULATE TOTAL MARKS
    // =====================================================

    const questions = await Question.findAll({
      where: {
        id: {
          [Op.in]: questionIds,
        },
      },
    });

    let totalMarks = 0;

    questions.forEach((item) => {
      totalMarks += item.marks || 0;
    });

    await assignment.update({
      totalMarks,
    });

  }

  return res.status(201).json({
    success: true,
    message: "Assignment created successfully",
    data: assignment,
  });

});

// =====================================================
// GET ALL ASSIGNMENTS
// =====================================================

export const getAllAssignments = catchAsync(async (req, res) => {

  const {
    courseId,
    topicId,
  } = req.query;

  let whereCondition = {
    isActive: true,
  };

  if (courseId) {
    whereCondition.courseId = courseId;
  }

  if (topicId) {
    whereCondition.topicId = topicId;
  }

  const response = await Assignment.findAll({

    where: whereCondition,

    include: [

      {
        model: Course,
        as: "course",

        attributes: [
          "id",
          "title",
        ],
      },

      {
        model: Topic,
        as: "topic",

        attributes: [
          "id",
          "title",
        ],
      },

      {
        model: Question,
        as: "questions",

        through: {
          attributes: [],
        },

        attributes: [
          "id",
          "question",
          "optionA",
          "optionB",
          "optionC",
          "optionD",
          "marks",
        ],
      },
    ],

    order: [["id", "DESC"]],

  });

  return res.status(200).json({
    success: true,
    count: response.length,
    data: response,
  });

});

// =====================================================
// UPDATE ASSIGNMENT
// =====================================================

export const updateAssignment = catchAsync(async (req, res) => {

  const { id } = req.params;

  const assignment = await Assignment.findByPk(id);

  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: "Assignment not found",
    });
  }

  await assignment.update(req.body);

  return res.status(200).json({
    success: true,
    message: "Assignment updated successfully",
    data: assignment,
  });

});

// =====================================================
// SUBMIT ANSWERS
// =====================================================

export const submitAssignmentAnswers = catchAsync(async (req, res) => {

  const {
    assignmentId,
    answers,
  } = req.body;

  const userId = req.user.id;

  // =====================================================
  // CHECK SUBSCRIPTION
  // =====================================================

  const assignment = await Assignment.findByPk(assignmentId);

  const subscription = await CourseSubscription.findOne({
    where: {
      userId,
      courseId: assignment.courseId,
      isActive: true,
    },
  });

  if (!subscription) {
    return res.status(403).json({
      success: false,
      message: "Please subscribe to this course",
    });
  }

  let totalMarks = 0;

  const formattedAnswers = [];

  // =====================================================
  // CHECK ANSWERS
  // =====================================================

  for (const item of answers) {

    const question = await Question.findByPk(item.questionId);

    const isCorrect =
      question.correctAnswer === item.studentAnswer;

    const marks = isCorrect ? question.marks : 0;

    totalMarks += marks;

    formattedAnswers.push({
      assignmentId,
      questionId: question.id,
      userId,

      studentAnswer: item.studentAnswer,
      correctAnswer: question.correctAnswer,
      explanation:question.explanation,

      explanation: isCorrect
        ? null
        : question.explanation,

      isCorrect,
      marks,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

  }

  await StudentAnswer.bulkCreate(formattedAnswers);

  return res.status(200).json({
    success: true,
    message: "Assignment submitted successfully",
    totalMarks,
  });

});

// =====================================================
// GET STUDENT RESULTS
// =====================================================

export const getStudentResults = catchAsync(async (req, res) => {

  const { userId, assignmentId } = req.query;

  let whereCondition = {};

  if (userId) {
    whereCondition.userId = userId;
  }

  if (assignmentId) {
    whereCondition.assignmentId = assignmentId;
  }

  const response = await StudentAnswer.findAll({

    where: whereCondition,

    include: [

      {
        model: Question,
        as: "question",

        attributes: [
          "id",
          "question",
          "optionA",
          "optionB",
          "optionC",
          "optionD",
        ],
      },

      {
        model: Assignment,
        as: "assignment",

        attributes: [
          "id",
          "title",
        ],
      },
    ],

    order: [["id", "DESC"]],

  });

  return res.status(200).json({
    success: true,
    count: response.length,
    data: response,
  });

});

export const createAssignmentQuestions = catchAsync(
  async (req, res) => {

    const {
      assignmentId,
      questionIds,
    } = req.body;

    // =====================================================
    // CHECK ASSIGNMENT
    // =====================================================

    const assignment = await Assignment.findByPk(
      assignmentId
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // =====================================================
    // VALIDATE QUESTIONS ARRAY
    // =====================================================

    if (
      !Array.isArray(questionIds) ||
      questionIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "questionIds array is required",
      });
    }

    // =====================================================
    // CHECK QUESTIONS EXIST
    // =====================================================

    const questions = await Question.findAll({
      where: {
        id: questionIds,
      },
    });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some questions not found",
      });
    }

    // =====================================================
    // PREPARE DATA
    // =====================================================

    const formattedData = questionIds.map(
      (questionId) => ({
        assignmentId,
        questionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    // =====================================================
    // INSERT
    // =====================================================

    const response =
      await AssignmentQuestion.bulkCreate(
        formattedData
      );

    // =====================================================
    // UPDATE TOTAL QUESTIONS
    // =====================================================

    await assignment.update({
      totalQuestions: questionIds.length,
    });

    return res.status(201).json({
      success: true,
      message:
        "Assignment questions added successfully",
      data: response,
    });

  }
);

// =====================================================
// GET ALL ASSIGNMENT QUESTIONS
// =====================================================

export const getAllAssignmentQuestions =
  catchAsync(async (req, res) => {

    const {
      assignmentId,
      questionId,
    } = req.query;

    let whereCondition = {};

    if (assignmentId) {
      whereCondition.assignmentId =
        assignmentId;
    }

    if (questionId) {
      whereCondition.questionId =
        questionId;
    }

    const response =
      await AssignmentQuestion.findAll({

        where: whereCondition,

        include: [

          {
            model: Assignment,
            as: "assignment",

            attributes: [
              "id",
              "title",
            ],
          },

          {
            model: Question,
            as: "question",

            attributes: [
              "id",
              "question",
              "optionA",
              "optionB",
              "optionC",
              "optionD",
            //   "correctAnswer",
              "marks",
            ],
          },

        ],

        order: [["id", "DESC"]],

      });

    return res.status(200).json({
      success: true,
      count: response.length,
      data: response,
    });

  });

// =====================================================
// GET ASSIGNMENT QUESTION BY ID
// =====================================================

export const getAssignmentQuestionById =
  catchAsync(async (req, res) => {

    const { id } = req.params;

    const response =
      await AssignmentQuestion.findByPk(id, {

        include: [

          {
            model: Assignment,
            as: "assignment",
          },

          {
            model: Question,
            as: "question",
          },

        ],

      });

    if (!response) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: response,
    });

  });

// =====================================================
// UPDATE ASSIGNMENT QUESTION
// =====================================================

export const updateAssignmentQuestion =
  catchAsync(async (req, res) => {

    const { id } = req.params;

    const assignmentQuestion =
      await AssignmentQuestion.findByPk(id);

    if (!assignmentQuestion) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment Question not found",
      });
    }

    await assignmentQuestion.update(req.body);

    return res.status(200).json({
      success: true,
      message:
        "Assignment Question updated successfully",
      data: assignmentQuestion,
    });

  });

// =====================================================
// DELETE ASSIGNMENT QUESTION
// =====================================================

export const deleteAssignmentQuestion =
  catchAsync(async (req, res) => {

    const { id } = req.params;

    const assignmentQuestion =
      await AssignmentQuestion.findByPk(id);

    if (!assignmentQuestion) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment Question not found",
      });
    }

    await assignmentQuestion.destroy();

    return res.status(200).json({
      success: true,
      message:
        "Assignment Question deleted successfully",
    });

  });