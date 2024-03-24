import asyncHandler from "../middlewares/asyncHandeler.middlewares.js";
import { User } from "../models/user.models.js";
import AppError from "../utils/error.utils.js";
import emailvalidatore from "email-validator";
import cloudnary from "cloudinary";
import fs from "fs/promises";

const cookieOPtions = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

//register
export const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError("All fields is required", 400));
  }
  const vaildEmail = emailvalidatore.validate(email);
  if (!vaildEmail) {
    return next(new AppError(" vaild email required", 400));
  }

  const userExits = await User.findOne({ email });
  if (userExits) {
    return next(new AppError("Email already exits", 400));
  }

  const user = await User.create({
    fullName,
    password,
    email,
    avatar: {
      public_id: email,
      secure_url:
        "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
    },
  });

  if (!user) {
    return next(new AppError("user Registation failed ,please try again", 400));
  }

  if (req.file) {
    const result = await cloudnary.v2.uploader.upload(req.file.path, {
      folder: "lms",
      width: 250,
      height: 250,
      gravity: "faces",
      crop: "fill",
    });

    if (result) {
      user.avatar.public_id = result.public_id;
      user.avatar.secure_url = result.secure_url;
    }
    fs.rm(`uploads/${req.file.filename}`);
  }

  await user.save();

  user.password = undefined;

  const token = await user.jwtToken();

  res.cookie("token", token, cookieOPtions);

  res.status(200).json({
    success: true,
    messsage: " user register successfully",
    user,
  });
});

//login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("All fields is required", 400));
  }
  const user = await User.findOne({ email }).select("+password ");

  if (!user || !user.comparePassword(password)) {
    return next(new AppError("Email or Password does not match", 400));
  }
  const token = await user.jwtToken();

  user.password = undefined;
  res.cookie("token", token, cookieOPtions);

  res.status(200).json({
    success: true,
    messsage: " user logged in successfully",
    user,
  });
});
//logout
export const logout = asyncHandler(async (_req, res, _next) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    messsage: " user logged out successfully",
  });
});
//profile

export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    message: "User details",
    user,
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("email is required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("email not exits", 400));
  }

  const resetToken = await user.generatePasswordResetToken();
  await user.save();

  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail(email, subject, message);

    // If email sent successfully send the success response
    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`,
    });
  } catch (error) {
    // If some error happened we need to clear the forgotPassword* fields in our DB
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    return next(
      new AppError(
        error.message || "Something went wrong, please try again.",
        500
      )
    );
  }
});
export const resetPassword = asyncHandler(async (req, res, next) => {});
