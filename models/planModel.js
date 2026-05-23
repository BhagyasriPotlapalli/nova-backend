export default (sequelize, DataTypes) => {
  const Plan = sequelize.define(
    "Plan",
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

          priceMonthly: DataTypes.FLOAT,
    priceYearly: DataTypes.FLOAT,

      courseLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

    //   durationInDays: {
    //     type: DataTypes.INTEGER,
    //     defaultValue: 30,
    //   },

      isUnlimited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return Plan;
};