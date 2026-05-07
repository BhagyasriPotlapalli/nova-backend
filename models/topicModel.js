// models/topic.model.js

export default (sequelize, DataTypes) => {
  const Topic = sequelize.define(
    "Topic",
    {
      categoryId: DataTypes.BIGINT,
      subCategoryId: DataTypes.BIGINT,
      courseId: DataTypes.BIGINT,
      moduleId: DataTypes.BIGINT,

      chapterId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      content: {
        type: DataTypes.TEXT("long"),
      },

      videoUrl: {
        type: DataTypes.STRING,
      },

      pdfUrl: {
        type: DataTypes.STRING,
      },

      orderNo: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      isFree: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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

  return Topic;
};