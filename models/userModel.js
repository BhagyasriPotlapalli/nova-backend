// models/user.model.js
export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      profile: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      role: {
        type: DataTypes.ENUM(
          "super_admin",
          "admin",
          "student",
          "faculty"
        ),
        defaultValue: "student",
      },

      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      webSiteLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      twitterLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      linkedInLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      consent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      isDeActivate: {
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

  return User;
};