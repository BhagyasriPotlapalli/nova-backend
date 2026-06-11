import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
const User = db.User;
const Course = db.Course;
const Payment = db.Payment;
import { Op } from "sequelize";
// 🔐 Generate Token (90 days)
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};
import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
  AdminInitiateAuthCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminAddUserToGroupCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  ForgotPasswordCommand,
  ListUsersCommand,
  ConfirmForgotPasswordCommand,
  AdminConfirmSignUpCommand,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "ap-south-1",
});

// ✅ Register
// export const register = async (req, res) => {
//   try {
//     const { password, email } = req.body;

//     const exists = await User.findOne({ where: { email } });

//     if (exists) {
//       return res.status(400).json({
//         message: "Email already exists",
//       });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // create user
//     const user = await User.create({
//       ...req.body,
//       password: hashedPassword,
//       isVerified:true,
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user,
//     });
//   } catch (err) {
//     res.status(400).json({
//       error: err.message,
//     });
//   }
// };
export const register = async (req, res) => {
  try {
    const { password, email, name } = req.body;

    const exists = await User.findOne({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    try {
      // Create user in Cognito and send email
      await cognito.send(
        new AdminCreateUserCommand({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,

          Username: email,

          DesiredDeliveryMediums: ["EMAIL"],

          UserAttributes: [
            {
              Name: "email",
              Value: email,
            },
            {
              Name: "name",
              Value: name || "",
            },
            {
              Name: "email_verified",
              Value: "true",
            },
          ],
        })
      );

      // Set permanent password
      await cognito.send(
        new AdminSetUserPasswordCommand({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          Username: email,
          Password: password,
          Permanent: true,
        })
      );
    } catch (error) {
      console.error("Cognito Error:", error);

      if (error.name === "UsernameExistsException") {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      return res.status(400).json({
        message: error.message,
      });
    }

    // Existing logic unchanged
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
      isVerified: true,
    });

    res.status(201).json({
      message:
        "User registered successfully. Invitation email sent successfully.",
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(400).json({
      error: err.message,
    });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔴 Check verification
    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      userId: user.id,
      role: user.role,
      consent: user.consent,
      email: user.email,
      token: `Bearer ${token}`,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🔑 Change Password (protected)
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Verify old password from Cognito
    // try {
    //   await cognito.send(
    //     new InitiateAuthCommand({
    //       AuthFlow: "USER_PASSWORD_AUTH",
    //       ClientId: process.env.COGNITO_CLIENT_ID,
    //       AuthParameters: {
    //         USERNAME: user.email,
    //         PASSWORD: oldPassword,
    //       },
    //     })
    //   );
    // } catch (error) {
    //   return res.status(400).json({
    //     message: "Old password incorrect",
    //   });
    // }

    // Update Cognito password
    await cognito.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: user.email,
        Password: newPassword,
        Permanent: true,
      })
    );

    // Store hashed password in DB
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.updatedBy = req.user.id;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// 🔄 Forgot Password (basic version)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const result = await cognito.send(
      new ForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
      })
    );

    res.status(200).json({
      message: "OTP sent successfully",
      result,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

export const confirmForgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and newPassword are required",
      });
    }

    await cognito.send(
      new ConfirmForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: otp,
        Password: newPassword,
      })
    );

    // Update hashed password in DB
    const user = await User.findOne({
      where: { email },
    });

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;

      await user.save();
    }

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};
// ✅ Verify User (manual/simple)
export const verifyUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: "User verified successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ======================================================
// GET USER BY ID
// ======================================================

export const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
      isDeleted: false,
    },

    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const getUsers = catchAsync(async (req, res) => {
 

  const user = await User.findAll({
    where: {
    
      isDeleted: false,
    },

    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});
export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  // ======================================================
  // CHECK USER
  // ======================================================

  const user = await User.findOne({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // ======================================================
  // EMAIL CHECK
  // ======================================================

  if (req.body.email) {
    const existingEmail = await User.findOne({
      where: {
        email: req.body.email,
        id: {
          [Op.ne]: id,
        },
      },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
  }

  // ======================================================
  // UPDATE ONLY SENT FIELDS
  // ======================================================

  const updatedData = {
    ...req.body,
    updatedBy: req.user?.id || null,
  };

  await user.update(updatedData);

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

const getMonthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
};

const getPreviousMonthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const end = new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59);
  return { start, end };
};
const getPercentageChange = (current, previous) => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const getDashboardStatus = catchAsync(async (req, res) => {
  try {
    const now = new Date();

    const currentMonth = getMonthRange(now);
    const prevMonth = getPreviousMonthRange(now);

    // ================= USERS =================
    const totalUsers = await User.count({
      where: { role: "student", isDeleted: false },
    });

    const currentStudents = await User.count({
      where: {
        role: "student",
        isDeleted: false,
        createdAt: {
          [Op.between]: [currentMonth.start, currentMonth.end],
        },
      },
    });

    const prevStudents = await User.count({
      where: {
        role: "student",
        isDeleted: false,
        createdAt: {
          [Op.between]: [prevMonth.start, prevMonth.end],
        },
      },
    });

    const userGrowthPercent = getPercentageChange(
      currentStudents,
      prevStudents,
    );

    // ================= COURSES =================
    const totalCourses = await Course.count({
      where: { deleted: false },
    });

    const currentCourses = await Course.count({
      where: {
        createdAt: {
          [Op.between]: [currentMonth.start, currentMonth.end],
        },
      },
    });

    const prevCourses = await Course.count({
      where: {
        createdAt: {
          [Op.between]: [prevMonth.start, prevMonth.end],
        },
      },
    });

    const courseGrowthPercent = getPercentageChange(
      currentCourses,
      prevCourses,
    );

    const totalRevenue =
      (await Payment.sum("amount", {
        where: {
          paymentStatus: "SUCCESS",
          isDeleted: false,
        },
      })) || 0;

    // current month revenue
    const currentRevenue =
      (await Payment.sum("amount", {
        where: {
          paymentStatus: "SUCCESS",
          isDeleted: false,
          createdAt: {
            [Op.between]: [currentMonth.start, currentMonth.end],
          },
        },
      })) || 0;

    // previous month revenue
    const prevRevenue =
      (await Payment.sum("amount", {
        where: {
          paymentStatus: "SUCCESS",
          isDeleted: false,
          createdAt: {
            [Op.between]: [prevMonth.start, prevMonth.end],
          },
        },
      })) || 0;

    const revenueGrowthPercent = getPercentageChange(
      currentRevenue,
      prevRevenue,
    );

    // ================= RESPONSE =================
    return res.json({
      success: true,
      data: {
        users: {
          totalUsers,
          currentMonthStudents: currentStudents,
          previousMonthStudents: prevStudents,
          growthPercent: userGrowthPercent.toFixed(2),
        },

        courses: {
          totalCourses,
          currentMonthCourses: currentCourses,
          previousMonthCourses: prevCourses,
          growthPercent: courseGrowthPercent.toFixed(2),
        },

        payments: {
          totalRevenue,
          currentMonthRevenue: currentRevenue,
          previousMonthRevenue: prevRevenue,
          growthPercent: revenueGrowthPercent.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Dashboard stats error",
      error: error.message,
    });
  }
});
