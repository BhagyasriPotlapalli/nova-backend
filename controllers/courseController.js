import {catchAsync} from "../utils/catchAsync.js";
import { Op } from "sequelize";


import db from "../models/index.js";
const User = db.User;
const Category=db.Category;
const SubCategory =db.SubCategory;
const Course =db.Course;
const Module =db.Module;
const  Chapter =db.Chapter;
const  Topic =db.Topic;
const Question =db.Question;



export const createMaster = catchAsync(async (req, res) => {

  const { type, questions, ...payload } = req.body;

  let response = null;

  // =====================================================
  // COMMON FIELDS
  // =====================================================

  payload.createdBy = req.user?.id;
  payload.updatedBy = req.user?.id;

  // =====================================================
  // CATEGORY
  // =====================================================

  if (type === "CATEGORY") {

    const existingCategory = await Category.findOne({
      where: {
        name: payload.name,
        deleted: false,
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    response = await Category.create(payload);

  }

  // =====================================================
  // SUB CATEGORY
  // =====================================================

  else if (type === "SUB_CATEGORY") {

    const existingSubCategory = await SubCategory.findOne({
      where: {
        name: payload.name,
        categoryId: payload.categoryId,
        deleted: false,
      },
    });

    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: "Sub Category already exists",
      });
    }

    response = await SubCategory.create(payload);

  }

  // =====================================================
  // COURSE
  // =====================================================

  else if (type === "COURSE") {

    const existingCourse = await Course.findOne({
      where: {
        title: payload.title,
        deleted: false,
      },
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    }

    response = await Course.create(payload);

  }

  // =====================================================
  // MODULE
  // =====================================================

  else if (type === "MODULE") {

    const existingModule = await Module.findOne({
      where: {
        title: payload.title,
        courseId: payload.courseId,
        deleted: false,
      },
    });

    if (existingModule) {
      return res.status(400).json({
        success: false,
        message: "Module already exists",
      });
    }

    response = await Module.create(payload);

  }

  // =====================================================
  // CHAPTER
  // =====================================================

  else if (type === "CHAPTER") {

    const existingChapter = await Chapter.findOne({
      where: {
        title: payload.title,
        moduleId: payload.moduleId,
        deleted: false,
      },
    });

    if (existingChapter) {
      return res.status(400).json({
        success: false,
        message: "Chapter already exists",
      });
    }

    response = await Chapter.create(payload);

  }

  // =====================================================
  // TOPIC
  // =====================================================

  else if (type === "TOPIC") {

    const existingTopic = await Topic.findOne({
      where: {
        title: payload.title,
        chapterId: payload.chapterId,
        deleted: false,
      },
    });

    if (existingTopic) {
      return res.status(400).json({
        success: false,
        message: "Topic already exists",
      });
    }

    response = await Topic.create(payload);

  }

  // =====================================================
  // QUESTION
  // =====================================================

  else if (type === "QUESTION") {

    if (!Array.isArray(questions) || questions.length === 0) {

      return res.status(400).json({
        success: false,
        message: "questions array is required",
      });

    }

    const formattedQuestions = questions.map((item) => ({
      ...item,

      categoryId: payload.categoryId,
      subCategoryId: payload.subCategoryId,
      courseId: payload.courseId,
      moduleId: payload.moduleId,
      chapterId: payload.chapterId,
      topicId: payload.topicId,

      createdBy: req.user?.id,
      updatedBy: req.user?.id,

      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    response = await Question.bulkCreate(formattedQuestions);

  }

  // =====================================================
  // INVALID TYPE
  // =====================================================

  else {

    return res.status(400).json({
      success: false,
      message: "Invalid type",
    });

  }

  return res.status(201).json({
    success: true,
    message: `${type} created successfully`,
    data: response,
  });

});

export const getAllCategories = catchAsync(async (req, res) => {

  const categories = await Category.findAll({

  where: {
    deleted: false,
  },

  include: [
    {
      model: SubCategory,
      as: "subCategories",

      where: {
        deleted: false,
      },

      required: false,

      attributes: [
        "id",
        "categoryId",
        "name",
        "slug",
        "description",
        "image",
        "createdAt",
      ],
    },
  ],

  attributes: [
    "id",
    "name",
    "slug",
    "description",
    "image",
    "color",
    "createdAt",
  ],

  order: [
    ["id", "DESC"],
  ],

});
  return res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });

});
const getModelByType = (type) => {

  switch (type) {

    case "CATEGORY":
      return Category;

    case "SUB_CATEGORY":
      return SubCategory;

    case "COURSE":
      return Course;

    case "MODULE":
      return Module;

    case "CHAPTER":
      return Chapter;

    case "TOPIC":
      return Topic;

    case "QUESTION":
      return Question;

    default:
      return null;

  }

};

export const updateMaster = catchAsync(async (req, res) => {

  const { type, id } = req.params;

  const payload = req.body;

  payload.updatedBy = req.user?.id;

  // ======================================================
  // MODEL
  // ======================================================

  const Model = getModelByType(type);

  if (!Model) {
    return res.status(400).json({
      success: false,
      message: "Invalid type",
    });
  }

  // ======================================================
  // FIND RECORD
  // ======================================================

  const existingData = await Model.findOne({
    where: {
      id,
      deleted: false,
    },
  });

  if (!existingData) {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  // ======================================================
  // DUPLICATE CHECK
  // ======================================================

  if (type === "CATEGORY" || type === "SUB_CATEGORY") {

    const duplicate = await Model.findOne({
      where: {
        name: payload.name,

        id: {
          [Op.ne]: id,
        },

        deleted: false,
      },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `${type} already exists`,
      });
    }

  }

  else if (type !== "QUESTION") {

    const duplicate = await Model.findOne({
      where: {
        title: payload.title,

        id: {
          [Op.ne]: id,
        },

        deleted: false,
      },
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `${type} already exists`,
      });
    }

  }

  // ======================================================
  // UPDATE
  // ======================================================

  await existingData.update(payload);

  return res.status(200).json({
    success: true,
    message: `${type} updated successfully`,
    data: existingData,
  });

});


// ==========================================================
// GET ALL MASTERS
// ==========================================================

export const getAllMasters = catchAsync(async (req, res) => {

  const {
    type,

    categoryId,
    subCategoryId,
    courseId,
    moduleId,
    chapterId,
    topicId,

    search,
    page = 1,
    limit = 10,
  } = req.query;

  // ======================================================
  // MODEL
  // ======================================================

  const Model = getModelByType(type);

  if (!Model) {
    return res.status(400).json({
      success: false,
      message: "Invalid type",
    });
  }

  // ======================================================
  // FILTERS
  // ======================================================

  const where = {
    deleted: false,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (subCategoryId) {
    where.subCategoryId = subCategoryId;
  }

  if (courseId) {
    where.courseId = courseId;
  }

  if (moduleId) {
    where.moduleId = moduleId;
  }

  if (chapterId) {
    where.chapterId = chapterId;
  }

  if (topicId) {
    where.topicId = topicId;
  }

  // ======================================================
  // SEARCH
  // ======================================================

  if (search) {

    if (type === "CATEGORY" || type === "SUB_CATEGORY") {

      where.name = {
        [Op.like]: `%${search}%`,
      };

    }

    else if (type === "QUESTION") {

      where.question = {
        [Op.like]: `%${search}%`,
      };

    }

    else {

      where.title = {
        [Op.like]: `%${search}%`,
      };

    }

  }

  // ======================================================
  // PAGINATION
  // ======================================================

  const offset = (page - 1) * limit;

  // ======================================================
  // GET DATA
  // ======================================================

  const { count, rows } = await Model.findAndCountAll({

    where,

    limit: Number(limit),

    offset: Number(offset),

    order: [["id", "DESC"]],
  });

  return res.status(200).json({
    success: true,

    totalRecords: count,

    currentPage: Number(page),

    totalPages: Math.ceil(count / limit),

    data: rows,
  });

});


// ==========================================================
// GET BY ID
// ==========================================================

export const getMasterById = catchAsync(async (req, res) => {

  const { type, id } = req.params;

  // ======================================================
  // MODEL
  // ======================================================

  const Model = getModelByType(type);

  if (!Model) {
    return res.status(400).json({
      success: false,
      message: "Invalid type",
    });
  }

  // ======================================================
  // GET RECORD
  // ======================================================

  const data = await Model.findOne({
    where: {
      id,
      deleted: false,
    },
  });

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  return res.status(200).json({
    success: true,
    data,
  });

});

