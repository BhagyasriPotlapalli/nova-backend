export default (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    "Subscription",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      razorpayOrderId: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      razorpayPaymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      razorpaySignature: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
planType: {
      type: DataTypes.ENUM("MONTHLY", "YEARLY"),
      allowNull: false,
    },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "ACTIVE",
          "FAILED",
          "EXPIRED"
        ),
        defaultValue: "PENDING",
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
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

  return Subscription;
};