import express from "express";
import {
  CreateEvaluation,
  UpdateEvaluation,
  GetAllEvaluations,
  DeleteEvaluation,
  GetEvaluationByStudent,
  GetEvaluationByCourse,
} from "../controllers/EvaluationController";

import { ValidatedID } from "../middlewares/ValidateID";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create-evaluation", verifyToken, CreateEvaluation);

router.get("/", verifyToken, verifyAdmin, GetAllEvaluations);

router.delete("/:id", verifyToken, ValidatedID, DeleteEvaluation);

router.put(
  "/update-evaluation/:id",
  verifyToken,
  ValidatedID,
  UpdateEvaluation
);

router.get(
  "/course/:courseId",
  verifyToken,
  ValidatedID,
  GetEvaluationByCourse
);

router.get(
  "/student/:studentId",
  verifyToken,
  ValidatedID,
  GetEvaluationByStudent
);

export default router;
