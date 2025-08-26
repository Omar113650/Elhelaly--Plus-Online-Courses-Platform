import express from "express";
import {
  EnrollInCourse,
  GetUserEnrollments,
  CancelEnrollment,
  ExportEnrollmentsCSV,
  ExportEnrollmentsExcel,
} from "../controllers/EnrollmentController";

import { ValidatedID } from "../middlewares/ValidateID";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/courses/:courseId/enroll", verifyToken, EnrollInCourse);

router.get("/user/:userId", verifyToken, ValidatedID, GetUserEnrollments);

router.delete("/:enrollmentId", verifyToken, ValidatedID, CancelEnrollment);

router.get(
  "/courses/:courseId/enrollments/export",
  verifyToken,
  verifyAdmin,
  ValidatedID,
  ExportEnrollmentsCSV
);

router.get(
  "/:courseId/enrollments/export-excel",
  verifyToken,
  verifyAdmin,
  ValidatedID,
  ExportEnrollmentsExcel
);

export default router;
