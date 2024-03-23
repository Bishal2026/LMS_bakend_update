import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/user.comtroller.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);
router.route("/logout").get(isLoggedIn, logout);
router.route("/me").get(isLoggedIn, getProfile);

export default router;
