'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    /* =========================================================
       PLANS TABLE
    ========================================================= */

    await queryInterface.createTable("Plans", {

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

      priceMonthly: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      priceYearly: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      courseLimit: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      isUnlimited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "Users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "Users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
       SUBSCRIPTIONS TABLE
    ========================================================= */

    await queryInterface.createTable("Subscriptions", {

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

      planId: {
        type: Sequelize.BIGINT,
        allowNull: false,

        references: {
          model: "Plans",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      razorpayOrderId: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      razorpayPaymentId: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      razorpaySignature: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      planType: {
        type: Sequelize.ENUM("MONTHLY", "YEARLY"),
        allowNull: false,
      },

      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "ACTIVE",
          "FAILED",
          "EXPIRED"
        ),
        defaultValue: "PENDING",
      },

      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "Users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "Users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
       PAYMENTS TABLE
    ========================================================= */

    await queryInterface.createTable("Payments", {

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

      subscriptionId: {
        type: Sequelize.BIGINT,
        allowNull: false,

        references: {
          model: "Subscriptions",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      razorpayOrderId: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      razorpayPaymentId: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING,
        defaultValue: "INR",
      },

      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      paymentStatus: {
        type: Sequelize.ENUM(
          "CREATED",
          "SUCCESS",
          "FAILED"
        ),
        defaultValue: "CREATED",
      },

      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "Users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "Users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
       SUBSCRIPTION COURSES TABLE
    ========================================================= */

    await queryInterface.createTable("SubscriptionCourses", {

      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      subscriptionId: {
        type: Sequelize.BIGINT,
        allowNull: false,

        references: {
          model: "Subscriptions",
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

      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "Users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,

        references: {
          model: "Users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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

    await queryInterface.dropTable("SubscriptionCourses");

    await queryInterface.dropTable("Payments");

    await queryInterface.dropTable("Subscriptions");

    await queryInterface.dropTable("Plans");

  },
};