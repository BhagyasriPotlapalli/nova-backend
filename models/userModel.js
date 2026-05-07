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
        // validate: { isEmail: true },
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
        type: DataTypes.ENUM("admin", "student", "faculty"),
        defaultValue: "student", // ✅ default role
      },
location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // ✅ new field
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
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // ✅ new field
      },
        isDeActivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // ✅ new field
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