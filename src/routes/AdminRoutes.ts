import express from "express";

import {
  RllRegister,
  AllEnrollInCourse,
  HighEnrolInCourse,
} from "../controllers/adminDashboardController";
const router = express.Router();

import { verifyAdmin } from "../middlewares/authMiddleware";
import { ValidatedID } from "../middlewares/ValidateID";
router.get("/dashboard/count-register", verifyAdmin, RllRegister);
router.get(
  "/dashboard/count-enroll/:courseId",
  verifyAdmin,
  ValidatedID,
  AllEnrollInCourse
);
router.get(
  "/dashboard/high-enroll/:courseId",
  verifyAdmin,
  ValidatedID,
  HighEnrolInCourse
);

export default router;
