import { Router } from "express";
import {
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/user.comtroller.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);
router.route("/logout").get(isLoggedIn, logout);
router.route("/me").get(isLoggedIn, getProfile);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password").post(resetPassword);

export default router;
