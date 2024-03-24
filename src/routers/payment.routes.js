import { Router } from "express";
import {
  allpayments,
  buySubcprtion,
  cancelSubcription,
  getRazorPayKey,
  verifySubcription,
} from "../controllers/payment.controllers.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/razorpay-key").get(isLoggedIn, getRazorPayKey);

router.route("/subcribe").post(isLoggedIn, buySubcprtion);
router.route("/verify").post(verifySubcription);

router.route("/unsubcribe").post(isLoggedIn, cancelSubcription);

router.route("/").get(isLoggedIn, authorizeRoles("ADMIN"), allpayments);

export default router;
