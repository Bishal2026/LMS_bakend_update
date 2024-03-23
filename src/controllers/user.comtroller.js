import asyncHandler from "../middlewares/asyncHandeler.middlewares.js";
import { User } from "../models/user.models.js";
import AppError from "../utils/error.utils.js";
import emailvalidatore from "email-validator";

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
