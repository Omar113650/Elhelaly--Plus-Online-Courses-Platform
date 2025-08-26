import express from "express";
import {
  CreateUser,
  GetUser,
  getUserById,
  deleteUser,
  updateUser,
  countUsersByRole,
  getUsersByRole,
  changeUserRole,
  getUserStats,
} from "../controllers/UserController";

import validate from "../middlewares/validate";
import {
  createUserSchema,
  updateUserSchema,
  countByRoleSchema,
  changeRoleSchema,
} from "../validation/userValidation";

import { ValidatedID } from "../middlewares/ValidateID";
import { verifyAdmin, verifyUserOrAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", validate(createUserSchema), CreateUser);

router.get("/", verifyAdmin, GetUser);

router.get("/:id", ValidatedID, verifyUserOrAdmin, getUserById);

router.put(
  "/:id",
  ValidatedID,
  verifyUserOrAdmin,
  validate(updateUserSchema),
  updateUser
);

router.delete("/:id", ValidatedID, verifyAdmin, deleteUser);

router.post(
  "/count",
  verifyAdmin,
  validate(countByRoleSchema),
  countUsersByRole
);

router.get("/role/:role", verifyAdmin, getUsersByRole);

router.patch(
  "/change-role/:id",
  ValidatedID,
  verifyAdmin,
  validate(changeRoleSchema),
  changeUserRole
);

router.get("/stats/overview", verifyAdmin, getUserStats);

export default router;
