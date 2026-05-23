export default (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      subscriptionId: {
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

      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING,
        defaultValue: "INR",
      },

      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      paymentStatus: {
        type: DataTypes.ENUM(
          "CREATED",
          "SUCCESS",
          "FAILED"
        ),
        defaultValue: "CREATED",
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

  return Payment;
};