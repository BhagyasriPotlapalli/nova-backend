// models/question.model.js

export default (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      categoryId: DataTypes.BIGINT,
      subCategoryId: DataTypes.BIGINT,
      courseId: DataTypes.BIGINT,
      moduleId: DataTypes.BIGINT,
      chapterId: DataTypes.BIGINT,

      topicId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      optionA: DataTypes.STRING,
      optionB: DataTypes.STRING,
      optionC: DataTypes.STRING,
      optionD: DataTypes.STRING,

      correctAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      explanation: {
        type: DataTypes.TEXT,
      },

      marks: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      difficultyLevel: {
        type: DataTypes.ENUM(
          "easy",
          "medium",
          "hard"
        ),
        defaultValue: "easy",
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

  return Question;
};