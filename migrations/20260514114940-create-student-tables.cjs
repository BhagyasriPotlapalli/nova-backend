'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    /* =========================================================
       COURSE SUBSCRIPTIONS TABLE
    ========================================================= */

    await queryInterface.createTable("CourseSubscriptions", {

      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
  type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "Users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      courseId: {
        type: Sequelize.BIGINT,
        allowNull: false,

        references: {
          model: "Courses",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      subscribeDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      expireDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
       ASSIGNMENTS TABLE
    ========================================================= */

    await queryInterface.createTable("Assignments", {

      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      courseId: {
        type: Sequelize.BIGINT,
        allowNull: false,

        references: {
          model: "Courses",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      topicId: {
        type: Sequelize.BIGINT,
        allowNull: false,

        references: {
          model: "Topics",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      totalMarks: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      totalQuestions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
       ASSIGNMENT QUESTIONS TABLE
    ========================================================= */

    await queryInterface.createTable("AssignmentQuestions", {

      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      assignmentId: {
        type: Sequelize.BIGINT,
        allowNull: false,

        references: {
          model: "Assignments",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      questionId: {
        type: Sequelize.BIGINT,
        allowNull: false,

        references: {
          model: "Questions",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
       STUDENT ANSWERS TABLE
    ========================================================= */

    await queryInterface.createTable("StudentAnswers", {

      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      assignmentId: {
        type: Sequelize.BIGINT,
        allowNull: false,

        references: {
          model: "Assignments",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      questionId: {
        type: Sequelize.BIGINT,
        allowNull: false,

        references: {
          model: "Questions",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
userId: {
  type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "Users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      studentAnswer: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      correctAnswer: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      explanation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      isCorrect: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      marks: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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

  },

  async down(queryInterface, Sequelize) {

    // await queryInterface.dropTable("StudentAnswers");

    // await queryInterface.dropTable("AssignmentQuestions");

    // await queryInterface.dropTable("Assignments");

    // await queryInterface.dropTable("CourseSubscriptions");

  },
};