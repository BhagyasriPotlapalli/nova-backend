import {catchAsync} from "../utils/catchAsync.js";
import { Op } from "sequelize";

const { sequelize } = db;
import {uploadToBunny} from "../utils/bunnyStorage.js"
import db from "../models/index.js";
const User = db.User;
const Category=db.Category;
const SubCategory =db.SubCategory;
const Course =db.Course;
const Module =db.Module;
const  Chapter =db.Chapter;
const  Topic =db.Topic;
const Question =db.Question;



// export const createMaster = catchAsync(async (req, res) => {

//   const { type, questions, ...payload } = req.body;

//   let response = null;

//   // =====================================================
//   // COMMON FIELDS
//   // =====================================================

//   payload.createdBy = req.user?.id;
//   payload.updatedBy = req.user?.id;

//   // =====================================================
//   // CATEGORY
//   // =====================================================

//   if (type === "CATEGORY") {

//     const existingCategory = await Category.findOne({
//       where: {
//         name: payload.name,
//         deleted: false,
//       },
//     });

//     if (existingCategory) {
//       return res.status(400).json({
//         success: false,
//         message: "Category already exists",
//       });
//     }

//     response = await Category.create(payload);

//   }

//   // =====================================================
//   // SUB CATEGORY
//   // =====================================================

//   else if (type === "SUB_CATEGORY") {

//     const existingSubCategory = await SubCategory.findOne({
//       where: {
//         name: payload.name,
//         categoryId: payload.categoryId,
//         deleted: false,
//       },
//     });

//     if (existingSubCategory) {
//       return res.status(400).json({
//         success: false,
//         message: "Sub Category already exists",
//       });
//     }

//     response = await SubCategory.create(payload);

//   }

//   // =====================================================
//   // COURSE
//   // =====================================================

//   else if (type === "COURSE") {

//     const existingCourse = await Course.findOne({
//       where: {
//         title: payload.title,
//         deleted: false,
//       },
//     });

//     if (existingCourse) {
//       return res.status(400).json({
//         success: false,
//         message: "Course already exists",
//       });
//     }

//     response = await Course.create(payload);

//   }

//   // =====================================================
//   // MODULE
//   // =====================================================

//   else if (type === "MODULE") {

//     const existingModule = await Module.findOne({
//       where: {
//         title: payload.title,
//         courseId: payload.courseId,
//         deleted: false,
//       },
//     });

//     if (existingModule) {
//       return res.status(400).json({
//         success: false,
//         message: "Module already exists",
//       });
//     }

//     response = await Module.create(payload);

//   }

//   // =====================================================
//   // CHAPTER
//   // =====================================================

//   else if (type === "CHAPTER") {

//     const existingChapter = await Chapter.findOne({
//       where: {
//         title: payload.title,
//         moduleId: payload.moduleId,
//         deleted: false,
//       },
//     });

//     if (existingChapter) {
//       return res.status(400).json({
//         success: false,
//         message: "Chapter already exists",
//       });
//     }

//     response = await Chapter.create(payload);

//   }

//   // =====================================================
//   // TOPIC
//   // =====================================================

//   // else if (type === "TOPIC") {

//   //   const existingTopic = await Topic.findOne({
//   //     where: {
//   //       title: payload.title,
//   //       chapterId: payload.chapterId,
//   //       deleted: false,
//   //     },
//   //   });

//   //   if (existingTopic) {
//   //     return res.status(400).json({
//   //       success: false,
//   //       message: "Topic already exists",
//   //     });
//   //   }

//   //   response = await Topic.create(payload);

//   // }
//   else if (type === "TOPIC") {

//   const existingTopic = await Topic.findOne({
//     where: {
//       title: payload.title,
//       chapterId: payload.chapterId,
//       deleted: false,
//     },
//   });

//   if (existingTopic) {
//     return res.status(400).json({
//       success: false,
//       message: "Topic already exists",
//     });
//   }

//   // =========================================
//   // VIDEO UPLOAD
//   // =========================================

//   if (req.files?.video?.[0]) {

//     const uploadedVideo = await uploadToBunny(
//       req.files.video[0],
//       "topics/videos"
//     );

//     payload.videoUrl = uploadedVideo.filePath;
//   }

//   // =========================================
//   // PDF UPLOAD
//   // =========================================

//   if (req.files?.pdf?.[0]) {

//     const uploadedPdf = await uploadToBunny(
//       req.files.pdf[0],
//       "topics/pdfs"
//     );

//     payload.pdfUrl = uploadedPdf.filePath;
//   }

//   response = await Topic.create(payload);

// }

//   // =====================================================
//   // QUESTION
//   // =====================================================

//   // else if (type === "QUESTION") {

//   //   if (!Array.isArray(questions) || questions.length === 0) {

//   //     return res.status(400).json({
//   //       success: false,
//   //       message: "questions array is required",
//   //     });

//   //   }

//   //   const formattedQuestions = questions.map((item) => ({
//   //     ...item,

//   //     categoryId: payload.categoryId,
//   //     subCategoryId: payload.subCategoryId,
//   //     courseId: payload.courseId,
//   //     moduleId: payload.moduleId,
//   //     chapterId: payload.chapterId,
//   //     topicId: payload.topicId,

//   //     createdBy: req.user?.id,
//   //     updatedBy: req.user?.id,

//   //     createdAt: new Date(),
//   //     updatedAt: new Date(),
//   //   }));

//   //   response = await Question.bulkCreate(formattedQuestions);

//   // }
//   else if (type === "QUESTION") {

//   if (!Array.isArray(questions) || questions.length === 0) {

//     return res.status(400).json({
//       success: false,
//       message: "questions array is required",
//     });

//   }

//   const formattedQuestions = await Promise.all(

//     questions.map(async (item, index) => {

//       // =========================================
//       // IMAGE OPTION TYPE
//       // =========================================

//       if (item.type === "Image") {

//         // OPTION A
//         const optionAFile = req.files?.find(
//           (f) => f.fieldname === `optionA_${index}`
//         );

//         if (optionAFile) {

//           const uploaded = await uploadToBunny(
//             optionAFile,
//             "questions/options"
//           );

//           item.optionA = uploaded.url;
//         }

//         // OPTION B
//         const optionBFile = req.files?.find(
//           (f) => f.fieldname === `optionB_${index}`
//         );

//         if (optionBFile) {

//           const uploaded = await uploadToBunny(
//             optionBFile,
//             "questions/options"
//           );

//           item.optionB = uploaded.url;
//         }

//         // OPTION C
//         const optionCFile = req.files?.find(
//           (f) => f.fieldname === `optionC_${index}`
//         );

//         if (optionCFile) {

//           const uploaded = await uploadToBunny(
//             optionCFile,
//             "questions/options"
//           );

//           item.optionC = uploaded.url;
//         }

//         // OPTION D
//         const optionDFile = req.files?.find(
//           (f) => f.fieldname === `optionD_${index}`
//         );

//         if (optionDFile) {

//           const uploaded = await uploadToBunny(
//             optionDFile,
//             "questions/options"
//           );

//           item.optionD = uploaded.url;
//         }

//       }

//       return {
//         ...item,

//         categoryId: payload.categoryId,
//         subCategoryId: payload.subCategoryId,
//         courseId: payload.courseId,
//         moduleId: payload.moduleId,
//         chapterId: payload.chapterId,
//         topicId: payload.topicId,

//         createdBy: req.user?.id,
//         updatedBy: req.user?.id,

//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//     })

//   );

//   response = await Question.bulkCreate(formattedQuestions);

// }

//   // =====================================================
//   // INVALID TYPE
//   // =====================================================

//   else {

//     return res.status(400).json({
//       success: false,
//       message: "Invalid type",
//     });

//   }

//   return res.status(201).json({
//     success: true,
//     message: `${type} created successfully`,
//     data: response,
//   });

// });

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

    // VIDEO UPLOAD
    if (req.files?.video?.[0]) {
      const uploadedVideo = await uploadToBunny(
        req.files.video[0],
        "topics/videos"
      );
      payload.videoUrl = uploadedVideo.filePath;
    }

    // PDF UPLOAD
    if (req.files?.pdf?.[0]) {
      const uploadedPdf = await uploadToBunny(
        req.files.pdf[0],
        "topics/pdfs"
      );
      payload.pdfUrl = uploadedPdf.filePath;
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

    const formattedQuestions = await Promise.all(
      questions.map(async (item, index) => {

        // =================================================
        // IMAGE TYPE HANDLING (FIXED PART ONLY)
        // =================================================

        if (item.type === "Image") {

          const optionMap = ["A", "B", "C", "D"];

          for (let opt of optionMap) {

            const file = req.files?.find(
              (f) => f.fieldname === `option${opt}_${index}`
            );

            if (file) {

              const uploaded = await uploadToBunny(
                file,
                "questions/options"
              );

              item[`option${opt}`] =
                uploaded.filePath || uploaded.url;
            }
          }
        }

        return {
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
        };
      })
    );

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
// TOPIC FILE UPLOAD
// ======================================================

if (type === "TOPIC") {

  // =========================================
  // VIDEO UPLOAD
  // =========================================

  if (req.files?.video?.[0]) {

    const uploadedVideo = await uploadToBunny(
      req.files.video[0],
      "topics/videos"
    );

    payload.videoUrl = uploadedVideo.url;
  }

  // =========================================
  // PDF UPLOAD
  // =========================================

  if (req.files?.pdf?.[0]) {

    const uploadedPdf = await uploadToBunny(
      req.files.pdf[0],
      "topics/pdfs"
    );

    payload.pdfUrl = uploadedPdf.url;
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

// export const getAllMasters = catchAsync(async (req, res) => {

//   const {
//     type,

//     categoryId,
//     subCategoryId,
//     courseId,
//     moduleId,
//     chapterId,
//     topicId,

//     search,
//     page = 1,
//     limit = 10,
//   } = req.query;

//   // ======================================================
//   // MODEL
//   // ======================================================

//   const Model = getModelByType(type);

//   if (!Model) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid type",
//     });
//   }

//   // ======================================================
//   // FILTERS
//   // ======================================================

//   const where = {
//     deleted: false,
//   };

//   if (type === "CATEGORY" && categoryId) {
//   where.id = categoryId;
// } else if (categoryId) {
//   where.categoryId = categoryId;
// }

//   if (subCategoryId) {
//     where.subCategoryId = subCategoryId;
//   }

//   if (courseId) {
//     where.courseId = courseId;
//   }

//   if (moduleId) {
//     where.moduleId = moduleId;
//   }

//   if (chapterId) {
//     where.chapterId = chapterId;
//   }

//   if (topicId) {
//     where.topicId = topicId;
//   }

//   // ======================================================
//   // SEARCH
//   // ======================================================

//   if (search) {

//     // if (type === "CATEGORY" || type === "SUB_CATEGORY") {

//     //   where.name = {
//     //     [Op.like]: `%${search}%`,
//     //   };

//     // }

//     // else if (type === "QUESTION") {

//     //   where.question = {
//     //     [Op.like]: `%${search}%`,
//     //   };

//     // }

//     // else {

//     //   where.title = {
//     //     [Op.like]: `%${search}%`,
//     //   };

//     // }

//     const searchFieldMap = {
//   CATEGORY: "title",
//   SUB_CATEGORY: "name",
//   QUESTION: "question",
// };

// const field = searchFieldMap[type] || "title";

// if (search) {
//   where[field] = {
//     [Op.like]: `%${search}%`,
//   };
// }

//   }

//   // ======================================================
//   // PAGINATION
//   // ======================================================

//   const offset = (page - 1) * limit;

//   // ======================================================
//   // GET DATA
//   // ======================================================

//   const { count, rows } = await Model.findAndCountAll({

//     where,

//     limit: Number(limit),

//     offset: Number(offset),

//     order: [["id", "DESC"]],
//   });

//   return res.status(200).json({
//     success: true,

//     totalRecords: count,

//     currentPage: Number(page),

//     totalPages: Math.ceil(count / limit),

//     data: rows,
//   });

// });
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

  if (type === "CATEGORY" && categoryId) {
    where.id = categoryId;
  } else if (categoryId) {
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

    const searchFieldMap = {
      CATEGORY: "title",
      SUB_CATEGORY: "name",
      COURSE: "title",
      MODULE: "title",
      CHAPTER: "title",
      TOPIC: "title",
      QUESTION: "question",
    };

    const field = searchFieldMap[type] || "title";

    where[field] = {
      [Op.like]: `%${search}%`,
    };
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

  // ======================================================
  // CHILD COUNT LOGIC (ADDED)
  // ======================================================

  const ChildModelMap = {
    CATEGORY: getModelByType("SUB_CATEGORY"),
    SUB_CATEGORY: getModelByType("COURSE"),
    COURSE: getModelByType("MODULE"),
    MODULE: getModelByType("CHAPTER"),
    CHAPTER: getModelByType("TOPIC"),
    TOPIC: getModelByType("QUESTION"),
  };

  const childModel = ChildModelMap[type];

  let dataWithCounts = rows;

  if (childModel) {
    let groupedCounts = [];

    // CATEGORY → SUB_CATEGORY
    if (type === "CATEGORY") {
      groupedCounts = await childModel.findAll({
        attributes: [
          "categoryId",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: { deleted: false },
        group: ["categoryId"],
        raw: true,
      });
    }

    // SUB_CATEGORY → COURSE
    if (type === "SUB_CATEGORY") {
      groupedCounts = await childModel.findAll({
        attributes: [
          "subCategoryId",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: { deleted: false },
        group: ["subCategoryId"],
        raw: true,
      });
    }

    // COURSE → MODULE
    if (type === "COURSE") {
      groupedCounts = await childModel.findAll({
        attributes: [
          "courseId",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: { deleted: false },
        group: ["courseId"],
        raw: true,
      });
    }

    // MODULE → CHAPTER
    if (type === "MODULE") {
      groupedCounts = await childModel.findAll({
        attributes: [
          "moduleId",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: { deleted: false },
        group: ["moduleId"],
        raw: true,
      });
    }

    // CHAPTER → TOPIC
    if (type === "CHAPTER") {
      groupedCounts = await childModel.findAll({
        attributes: [
          "chapterId",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: { deleted: false },
        group: ["chapterId"],
        raw: true,
      });
    }

    // TOPIC → QUESTION
    if (type === "TOPIC") {
      groupedCounts = await childModel.findAll({
        attributes: [
          "topicId",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: { deleted: false },
        group: ["topicId"],
        raw: true,
      });
    }

    // ======================================================
    // MAP COUNTS
    // ======================================================

    const countMap = {};

    groupedCounts.forEach((item) => {
      const key =
        item.categoryId ||
        item.subCategoryId ||
        item.courseId ||
        item.moduleId ||
        item.chapterId ||
        item.topicId;

      countMap[key] = Number(item.count);
    });

    // ======================================================
    // ATTACH COUNT
    // ======================================================

    dataWithCounts = rows.map((row) => {
      const data = row.toJSON ? row.toJSON() : row;

      return {
        ...data,
        childCount: countMap[data.id] || 0,
      };
    });
  }

  // ======================================================
  // RESPONSE
  // ======================================================

  return res.status(200).json({
    success: true,
    totalRecords: count,
    currentPage: Number(page),
    totalPages: Math.ceil(count / limit),
    data: dataWithCounts,
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



export const softDeleteMasters = catchAsync(async (req, res) => {
  const {
    type,

    categoryId,
    subCategoryId,
    courseId,
    moduleId,
    chapterId,
    topicId,
    questionId,
  } = req.body;

  // ======================================================
  // VALIDATION
  // ======================================================

  if (!type) {
    return res.status(400).json({
      success: false,
      message: "Type is required",
    });
  }

  // ======================================================
  // CATEGORY DELETE
  // ======================================================

  if (type === "CATEGORY") {
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      });
    }

    await Category.update(
      { deleted: true },
      { where: { id: categoryId } }
    );

    await SubCategory.update(
      { deleted: true },
      { where: { categoryId } }
    );

    await Course.update(
      { deleted: true },
      { where: { categoryId } }
    );

    await Module.update(
      { deleted: true },
      { where: { categoryId } }
    );

    await Chapter.update(
      { deleted: true },
      { where: { categoryId } }
    );

    await Topic.update(
      { deleted: true },
      { where: { categoryId } }
    );

    await Question.update(
      { deleted: true },
      { where: { categoryId } }
    );

    return res.status(200).json({
      success: true,
      message: "Category and all related data soft deleted successfully",
    });
  }

  // ======================================================
  // SUB CATEGORY DELETE
  // ======================================================

  if (type === "SUB_CATEGORY") {
    if (!subCategoryId) {
      return res.status(400).json({
        success: false,
        message: "subCategoryId is required",
      });
    }

    await SubCategory.update(
      { deleted: true },
      { where: { id: subCategoryId } }
    );

    await Course.update(
      { deleted: true },
      { where: { subCategoryId } }
    );

    await Module.update(
      { deleted: true },
      { where: { subCategoryId } }
    );

    await Chapter.update(
      { deleted: true },
      { where: { subCategoryId } }
    );

    await Topic.update(
      { deleted: true },
      { where: { subCategoryId } }
    );

    await Question.update(
      { deleted: true },
      { where: { subCategoryId } }
    );

    return res.status(200).json({
      success: true,
      message: "SubCategory and related data soft deleted successfully",
    });
  }

  // ======================================================
  // COURSE DELETE
  // ======================================================

  if (type === "COURSE") {
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    await Course.update(
      { deleted: true },
      { where: { id: courseId } }
    );

    await Module.update(
      { deleted: true },
      { where: { courseId } }
    );

    await Chapter.update(
      { deleted: true },
      { where: { courseId } }
    );

    await Topic.update(
      { deleted: true },
      { where: { courseId } }
    );

    await Question.update(
      { deleted: true },
      { where: { courseId } }
    );

    return res.status(200).json({
      success: true,
      message: "Course and related data soft deleted successfully",
    });
  }

  // ======================================================
  // MODULE DELETE
  // ======================================================

  if (type === "MODULE") {
    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: "moduleId is required",
      });
    }

    await Module.update(
      { deleted: true },
      { where: { id: moduleId } }
    );

    await Chapter.update(
      { deleted: true },
      { where: { moduleId } }
    );

    await Topic.update(
      { deleted: true },
      { where: { moduleId } }
    );

    await Question.update(
      { deleted: true },
      { where: { moduleId } }
    );

    return res.status(200).json({
      success: true,
      message: "Module and related data soft deleted successfully",
    });
  }

  // ======================================================
  // CHAPTER DELETE
  // ======================================================

  if (type === "CHAPTER") {
    if (!chapterId) {
      return res.status(400).json({
        success: false,
        message: "chapterId is required",
      });
    }

    await Chapter.update(
      { deleted: true },
      { where: { id: chapterId } }
    );

    await Topic.update(
      { deleted: true },
      { where: { chapterId } }
    );

    await Question.update(
      { deleted: true },
      { where: { chapterId } }
    );

    return res.status(200).json({
      success: true,
      message: "Chapter and related data soft deleted successfully",
    });
  }

  // ======================================================
  // TOPIC DELETE
  // ======================================================

  if (type === "TOPIC") {
    if (!topicId) {
      return res.status(400).json({
        success: false,
        message: "topicId is required",
      });
    }

    await Topic.update(
      { deleted: true },
      { where: { id: topicId } }
    );

    await Question.update(
      { deleted: true },
      { where: { topicId } }
    );

    return res.status(200).json({
      success: true,
      message: "Topic and related data soft deleted successfully",
    });
  }

  // ======================================================
  // QUESTION DELETE
  // ======================================================

  if (type === "QUESTION") {
    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "questionId is required",
      });
    }

    await Question.update(
      { deleted: true },
      { where: { id: questionId } }
    );

    return res.status(200).json({
      success: true,
      message: "Question soft deleted successfully",
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid type",
  });
});

