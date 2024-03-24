import { Router } from "express";
import {
  UpdateCourse,
  addLecturesById,
  createCourse,
  getLecturesByCouresId,
  getallCoures,
  removeCourse,
} from "../controllers/coures.controller.js";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/")
  .get(getallCoures)
  .post(
    isLoggedIn,
    authorizeRoles("ADMIN"),
    upload.single("tumbails"),
    createCourse
  );

router
  .route("/:id")
  .get(isLoggedIn, getLecturesByCouresId)
  .put(isLoggedIn, authorizeRoles("ADMIN"), UpdateCourse)
  .delete(isLoggedIn, authorizeRoles("ADMIN"), removeCourse)
  .post(
    isLoggedIn,
    authorizeRoles("ADMIN"),

    upload.single("lecture"),
    addLecturesById
  );

export default router;