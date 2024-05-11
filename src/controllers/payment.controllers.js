import { razorpay } from "../index.js";
import asyncHandler from "../middlewares/asyncHandeler.middlewares.js";
import Payment from "../models/payment.models.js";
import { User } from "../models/user.models.js";
import AppError from "../utils/error.utils.js";
import crypto from "crypto";

export const getRazorPayKey = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Razorpay API Key",
    key: process.env.RAZORPAY_KEY_ID,
  });
});

export const buySubcprtion = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("Unauthorized ,please login", 400));
  }
  if (!user.role === "ADMIN") {
    return next(new AppError("ADMIN cannot subcribe", 400));
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID,
    customer_notify: 1,
  });

  user.subscription.id = subscription.id;
  console.log(user.subscription.id);
  user.subscription.status = subscription.status;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Subcribed Suceesfully",
    subscription_id: subscription.id,
  });
});

export const verifySubcription = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
    req.body;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("Unauthorized ,please login", 400));
  }

  const subscriptionId = user.subscription.id;

  const generatedSignature = crypto
    .createHash("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpay_payment_id} | ${subscriptionId}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return next(new AppError("payment not verify", 500));
  }

  await Payment.create({
    razorpay_payment_id,
    razorpay_signature,
    razorpay_subscription_id,
  });

  user.subscription.status = "active";
  await user.save();
  res.status(200).json({
    success: true,
    message: "Payment or verify successfilly",
  });
});

export const cancelSubcription = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("Unauthorized ,please login", 400));
  }
  if (!user.role === "ADMIN") {
    return next(new AppError("ADMIN cannot cancle", 400));
  }

  const subscriptionId = user.subscription.id;

  const subscription = await razorpay.subscriptions.cancel(subscriptionId);

  user.subscription.status = subscription.status;
  await user.save();

  res.status(200).json({
    success: true,
    message: "cancle subscbction",
  });
});

export const allpayments = asyncHandler(async (req, res, next) => {
  const { count } = req.query;
  const subsriptions = await razorpay.subscriptions.all({ count: count || 10 });
  res.status(200).json({
    success: true,
    message: "ALl payment",
    subsriptions,
  });
});
