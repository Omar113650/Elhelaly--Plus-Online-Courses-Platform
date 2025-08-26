import express from "express";
import {
  GetLesson,
  CreateLesson,
  UpdateLesson,
  CountLesson,
  DeleteLesson,
} from "../controllers/LessonController";
import uploadVideo from "../middlewares/multer";
import { ValidatedID } from "../middlewares/ValidateID";
import { verifyAdmin } from "../middlewares/authMiddleware";
const router = express.Router();

router.get("/count", CountLesson);
router.post(
  "/upload-lesson",
  verifyAdmin,
  uploadVideo.single("video"),
  CreateLesson
);

router.put(
  "/update/:id",
  verifyAdmin,
  ValidatedID,
  uploadVideo.single("video"),
  UpdateLesson
);

router.delete("/:id", verifyAdmin, ValidatedID, DeleteLesson);

router.get("/", GetLesson);

export default router;
