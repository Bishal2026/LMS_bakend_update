import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  updateUser,
} from "../controllers/user.comtroller.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);
router.route("/logout").get(isLoggedIn, logout);
router.route("/me").get(isLoggedIn, getProfile);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset/:resetToken").post(resetPassword);
router.route("/change-password").post(isLoggedIn, changePassword);

router
  .route("/update/:id")
  .put(isLoggedIn, upload.single("avatar"), updateUser);
export default router;
