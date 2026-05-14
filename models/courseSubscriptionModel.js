// models/courseSubscription.model.js

export default (sequelize, DataTypes) => {
  const CourseSubscription = sequelize.define(
    "CourseSubscription",
    {
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      courseId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      subscribeDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      expireDate: {
        type: DataTypes.DATE,
        allowNull: true,
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

  return CourseSubscription;
};