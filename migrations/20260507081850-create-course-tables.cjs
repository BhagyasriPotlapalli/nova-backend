'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /* =========================================================
       CATEGORY TABLE
    ========================================================= */
    await queryInterface.createTable("Categories", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      color: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },

      updatedBy: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    /* =========================================================
       SUBCATEGORY TABLE
    ========================================================= */
    await queryInterface.createTable("SubCategories", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      categoryId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.TEXT,
      },

      image: {
        type: Sequelize.STRING,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: Sequelize.BIGINT,
      updatedBy: Sequelize.BIGINT,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    /* =========================================================
       COURSE TABLE
    ========================================================= */
    await queryInterface.createTable("Courses", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      categoryId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },

      subCategoryId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "SubCategories",
          key: "id",
        },
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING,
        unique: true,
      },

      description: {
        type: Sequelize.TEXT,
      },

      thumbnail: {
        type: Sequelize.STRING,
      },

      level: {
        type: Sequelize.ENUM(
          "beginner",
          "intermediate",
          "advanced"
        ),
        defaultValue: "beginner",
      },

      duration: {
        type: Sequelize.STRING,
      },

      price: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: Sequelize.BIGINT,
      updatedBy: Sequelize.BIGINT,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    /* =========================================================
       MODULE TABLE
    ========================================================= */
    await queryInterface.createTable("Modules", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      categoryId: Sequelize.BIGINT,
      subCategoryId: Sequelize.BIGINT,

      courseId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Courses",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: Sequelize.TEXT,

      orderNo: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: Sequelize.BIGINT,
      updatedBy: Sequelize.BIGINT,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    /* =========================================================
       CHAPTER TABLE
    ========================================================= */
    await queryInterface.createTable("Chapters", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      categoryId: Sequelize.BIGINT,
      subCategoryId: Sequelize.BIGINT,
      courseId: Sequelize.BIGINT,

      moduleId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Modules",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: Sequelize.TEXT,

      orderNo: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: Sequelize.BIGINT,
      updatedBy: Sequelize.BIGINT,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    /* =========================================================
       TOPIC TABLE
    ========================================================= */
    await queryInterface.createTable("Topics", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      categoryId: Sequelize.BIGINT,
      subCategoryId: Sequelize.BIGINT,
      courseId: Sequelize.BIGINT,
      moduleId: Sequelize.BIGINT,

      chapterId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Chapters",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      content: {
        type: Sequelize.TEXT("long"),
      },

      videoUrl: Sequelize.STRING,

      pdfUrl: Sequelize.STRING,

      orderNo: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },

      isFree: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: Sequelize.BIGINT,
      updatedBy: Sequelize.BIGINT,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    /* =========================================================
       QUESTION TABLE
    ========================================================= */
    await queryInterface.createTable("Questions", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      categoryId: Sequelize.BIGINT,
      subCategoryId: Sequelize.BIGINT,
      courseId: Sequelize.BIGINT,
      moduleId: Sequelize.BIGINT,
      chapterId: Sequelize.BIGINT,

      topicId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Topics",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
type: {
  type: DataTypes.ENUM("Text", "Image"),
  defaultValue: "Text",
},
      optionA: Sequelize.STRING,
      optionB: Sequelize.STRING,
      optionC: Sequelize.STRING,
      optionD: Sequelize.STRING,

      correctAnswer: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      explanation: Sequelize.TEXT,

      marks: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },

      difficultyLevel: {
        type: Sequelize.ENUM(
          "easy",
          "medium",
          "hard"
        ),
        defaultValue: "easy",
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: Sequelize.BIGINT,
      updatedBy: Sequelize.BIGINT,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable("Questions");
    // await queryInterface.dropTable("Topics");
    // await queryInterface.dropTable("Chapters");
    // await queryInterface.dropTable("Modules");
    // await queryInterface.dropTable("Courses");
    // await queryInterface.dropTable("SubCategories");
    // await queryInterface.dropTable("Categories");
  },
};