import asyncHandler from "../middlewares/asyncHandeler.middlewares.js";
import Course from "../models/coures.models.js";
import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary";

import fs from "fs/promises";

export const getallCoures = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({}).select("-lectures");

  res.status(200).json({
    success: true,
    message: "All Coures",
    courses,
  });
});

export const getLecturesByCouresId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError("Invalid course id or course not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Course lectures fetched successfully",
    lectures: course.lectures,
  });
});

export const createCourse = asyncHandler(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError("All fields are required", 400));
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
  });

  if (!course) {
    return next(
      new AppError("Course could not be created, please try again", 400)
    );
  }

  // Run only if user sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms", // Save files in a folder named lms
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in array
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }

      // After successful upload remove the file from local storage
      fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      // Empty the uploads directory without deleting the uploads directory
      for (const file of await fs.readdir("uploads/")) {
        await fs.unlink(path.join("uploads/", file));
      }

      // Send the error message
      return next(
        new AppError(
          JSON.stringify(error) || "File not uploaded, please try again",
          400
        )
      );
    }
  }

  // Save the changes
  await course.save();

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course,
  });
});

export const UpdateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    {
      runValidators: true,
    }
  );
  if (!course) {
    return next(new AppError("Course  id not define cheack its", 400));
  }
  res.status(201).json({
    success: true,
    message: "Course upadte successfully",
    course,
  });
});

export const removeCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    return next(new AppError("Course  id not define cheack its", 400));
  }

  await Course.findByIdAndDelete(id);

  res.status(201).json({
    success: true,
    message: "Course delete successfully",
  });
});

export const addLecturesById = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title || !description) {
    return next(new AppError("Title and Description are required", 400));
  }

  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError("Invalid course id or course not found.", 400));
  }

  let lectureData = {
    title,
    description,
    lecture: {},
  };

  // Run only if user sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms", // Save files in a folder named lms
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in array
        lectureData.lecture.public_id = result.public_id;
        lectureData.lecture.secure_url = result.secure_url;
      }

      // After successful upload remove the file from local storage
      fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      // Empty the uploads directory without deleting the uploads directory
      for (const file of await fs.readdir("uploads/")) {
        await fs.unlink(path.join("uploads/", file));
      }

      // Send the error message
      return next(
        new AppError(
          JSON.stringify(error) || "File not uploaded, please try again",
          400
        )
      );
    }
  }

  course.lectures.push(lectureData);

  course.numberOfLectures = course.lectures.length;

  // Save the course object
  await course.save();

  res.status(200).json({
    success: true,
    message: "Course lecture added successfully",
    course,
  });
});