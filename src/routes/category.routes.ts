import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  countCategories,
} from "../controllers/CategoryController";

import { ValidatedID } from "../middlewares/ValidateID";
import validate from "../middlewares/validate";
import {
  CreateCategory,
  UpdataCategory,
} from "../validation/categoryValidation";


import {
  
  verifyAdmin,
} from "../middlewares/authMiddleware";

const router = express.Router();


router.get("/", getAllCategories);
router.get("/count", countCategories);
router.get("/:id", ValidatedID, getCategoryById);


router.post("/", verifyAdmin, validate(CreateCategory), createCategory);
router.put(
  "/updateCategory/:id",
  verifyAdmin,
  ValidatedID,
  validate(UpdataCategory),
  updateCategory
);
router.delete("/deleteCategory/:id", verifyAdmin, ValidatedID, deleteCategory);

export default router;
