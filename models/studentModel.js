// models/subscriptionPlan.model.js

export default (sequelize, DataTypes) => {
  const SubscriptionPlan = sequelize.define(
    "SubscriptionPlan",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      subscriptionType: {
        type: DataTypes.ENUM(
          "monthly",
          "quarterly",
          "half_yearly",
          "yearly",
          "lifetime",
        ),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      durationInDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      features: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      isPopular: {
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
    },
  );

  return SubscriptionPlan;
};
