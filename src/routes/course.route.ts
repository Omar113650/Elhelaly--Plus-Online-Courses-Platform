import express from "express";
import {
  CreateCourse,
  GetAllCourses,
  GetCourseById,
  UpdateCourse,
  DeleteCourse,
  CountCourses,
  GetTopCourses,
} from "../controllers/CourseController";

import validate from "../middlewares/validate";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../validation/courseValidation";

import { ValidatedID } from "../middlewares/ValidateID";

import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/count/all", CountCourses);
router.get("/top", GetTopCourses);
router.get("/", GetAllCourses);
router.get("/:id", ValidatedID, GetCourseById);

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  validate(createCourseSchema),
  CreateCourse
);
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  ValidatedID,
  validate(updateCourseSchema),
  UpdateCourse
);
router.delete("/:id", verifyToken, verifyAdmin, ValidatedID, DeleteCourse);

export default router;
