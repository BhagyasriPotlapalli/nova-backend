// models/category.model.js

export default (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      createdBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      updatedBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return Category;
};