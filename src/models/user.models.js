import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgotpasswordToken: String,
    forgotpasswordExpriry: Date,
    subscription:{
      id:String,
      status: String,
    },
  }
  ,
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  jwtToken: async function () {
    return await jwt.sign(
      {
        id: this._id,
        role: this.role,
        subscription: this.subscription,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },
  comparePassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },

  generatePasswordResetToken: async function () {
    const resetToken = crypto.randomBytes(20).toString("hex")

    this.forgotpasswordToken = crypto.createHash("sha256")
    .update(resetToken).digest("hex")
    this.forgotpasswordExpriry = Date.now() =15*60*1000;

    return resetToken;
  },
};

export const User = mongoose.model("User", userSchema);
