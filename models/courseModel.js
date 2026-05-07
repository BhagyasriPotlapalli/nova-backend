// models/course.model.js

export default (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      categoryId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      subCategoryId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      slug: {
        type: DataTypes.STRING,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT,
      },

      thumbnail: {
        type: DataTypes.STRING,
      },

      level: {
        type: DataTypes.ENUM(
          "beginner",
          "intermediate",
          "advanced"
        ),
        defaultValue: "beginner",
      },

      duration: {
        type: DataTypes.STRING,
      },

      price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      createdBy: DataTypes.BIGINT,
      updatedBy: DataTypes.BIGINT,
    },
    {
      timestamps: true,
    }
  );

  return Course;
};