import { Router } from "express";
import {
  UpdateCourse,
  addLectureToCourseById,
  createCourse,
  getLecturesByCouresId,
  getallCoures,
  removeLectureFromCourse,
} from "../controllers/coures.controller.js";
import {
  authorizeRoles,
  authorizeSubscriber,
  isLoggedIn,
} from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/")
  .get(getallCoures)
  .post(
    isLoggedIn,
    authorizeRoles("ADMIN"),
    upload.single("thumbnail"),
    createCourse
  )
  .delete(isLoggedIn, authorizeRoles("ADMIN"), removeLectureFromCourse);

router
  .route("/:id")
  .get(isLoggedIn, authorizeSubscriber, getLecturesByCouresId)
  .put(isLoggedIn, authorizeRoles("ADMIN"), UpdateCourse)
  .post(
    isLoggedIn,
    authorizeRoles("ADMIN"),

    upload.single("lecture"),
    addLectureToCourseById
  );

export default router;
