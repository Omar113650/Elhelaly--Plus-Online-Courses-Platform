import express from "express";
import {
  CreateComment,
  GetComment,
  GetCommentById,
  CountComment,
  DeleteComment,
  UpdateComment,
} from "../controllers/CommentController";
import { ValidatedID } from "../middlewares/ValidateID";

import { verifyToken, verifyUserOrAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", GetComment);
router.get("/count", CountComment);
router.get("/:id", ValidatedID, GetCommentById);

router.post("/create-comment", verifyToken, CreateComment);

router.patch(
  "/updata-comment/:id",
  verifyUserOrAdmin,
  ValidatedID,
  UpdateComment
);
router.delete("/:id", verifyUserOrAdmin, ValidatedID, DeleteComment);

export default router;
