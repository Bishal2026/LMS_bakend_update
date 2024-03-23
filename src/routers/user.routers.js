import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/user.comtroller.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isLoggedIn, logout);
router.route("/me").get(isLoggedIn, getProfile);

export default router;
