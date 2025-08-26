import express from "express";
import {
  Register,
  Signin,
  logout,
  verifyAccount,
  sendResetPasswordLink,
  validateResetPasswordLink,
  resetPassword,
} from "../controllers/AuthController";

import validate from "../middlewares/validate";
import { RegisterValidate, LoginValidate ,NewPasswordValidate} from "../validation/userValidation";

const router = express.Router();

router.post("/register", validate(RegisterValidate), Register);

router.post("/signin", validate(LoginValidate), Signin);

router.post("/logout", logout);
router.post("/verify-account", verifyAccount);

router.post("/forgot-password", sendResetPasswordLink);
router.get("/reset-password/:userId/:token", validateResetPasswordLink);
router.post("/reset-password/:userId/:token", validate(NewPasswordValidate),resetPassword);
export default router;
