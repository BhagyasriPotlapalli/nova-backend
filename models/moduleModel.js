// models/module.model.js

export default (sequelize, DataTypes) => {
  const Module = sequelize.define(
    "Module",
    {
      categoryId: DataTypes.BIGINT,
      subCategoryId: DataTypes.BIGINT,

      courseId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },

      orderNo: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
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

  return Module;
};