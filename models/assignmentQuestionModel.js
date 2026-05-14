// models/assignmentQuestion.model.js

export default (sequelize, DataTypes) => {
  const AssignmentQuestion = sequelize.define(
    "AssignmentQuestion",
    {
      assignmentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      questionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return AssignmentQuestion;
};