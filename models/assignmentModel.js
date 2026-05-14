// models/assignment.model.js

export default (sequelize, DataTypes) => {
  const Assignment = sequelize.define(
    "Assignment",
    {
      courseId: DataTypes.BIGINT,

      topicId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      totalMarks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      totalQuestions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return Assignment;
};