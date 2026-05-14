// models/studentAnswer.model.js

export default (sequelize, DataTypes) => {
  const StudentAnswer = sequelize.define(
    "StudentAnswer",
    {
      assignmentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      questionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      studentAnswer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      correctAnswer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      explanation: {
        type: DataTypes.TEXT,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      marks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  return StudentAnswer;
};