import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import Sequelize from "sequelize";
import process from "process";
import configFile from "../config/config.cjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const db = {};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// 👇 READ FILES
const files = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.endsWith(".js")
  );

// 👇 IMPORT ALL MODELS
for (const file of files) {
  const fullPath = path.join(__dirname, file);

  const module = await import(pathToFileURL(fullPath));

  const model = module.default(
    sequelize,
    Sequelize.DataTypes
  );

  db[model.name] = model;
}

/* =========================================================
   ASSOCIATIONS
========================================================= */

const {
  Category,
  SubCategory,
  Course,
  Module,
  Chapter,
  Topic,
  Question,
} = db;

// Category → SubCategory
if (Category && SubCategory) {
  Category.hasMany(SubCategory, {
    foreignKey: "categoryId",
    as: "subCategories",
  });

  SubCategory.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
  });
}

// SubCategory → Course
if (SubCategory && Course) {
  SubCategory.hasMany(Course, {
    foreignKey: "subCategoryId",
    as: "courses",
  });

  Course.belongsTo(SubCategory, {
    foreignKey: "subCategoryId",
    as: "subCategory",
  });
}

// Course → Module
if (Course && Module) {
  Course.hasMany(Module, {
    foreignKey: "courseId",
    as: "modules",
  });

  Module.belongsTo(Course, {
    foreignKey: "courseId",
    as: "course",
  });
}

// Module → Chapter
if (Module && Chapter) {
  Module.hasMany(Chapter, {
    foreignKey: "moduleId",
    as: "chapters",
  });

  Chapter.belongsTo(Module, {
    foreignKey: "moduleId",
    as: "module",
  });
}

// Chapter → Topic
if (Chapter && Topic) {
  Chapter.hasMany(Topic, {
    foreignKey: "chapterId",
    as: "topics",
  });

  Topic.belongsTo(Chapter, {
    foreignKey: "chapterId",
    as: "chapter",
  });
}

// Topic → Question
if (Topic && Question) {
  Topic.hasMany(Question, {
    foreignKey: "topicId",
    as: "questions",
  });

  Question.belongsTo(Topic, {
    foreignKey: "topicId",
    as: "topic",
  });
}

// 👇 EXISTING associate FUNCTION SUPPORT
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;