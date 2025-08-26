import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import VerificationCode from "../models/VerificationCode";
import { sendEmail } from "../utils/emailServices";
import PasswordResetToken from "../models/PasswordResetToken";
import crypto from "crypto";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const Register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res
        .status(400)
        .json({ message: "Name, email, role, and password are required" });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isActive: false,
      role,
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await VerificationCode.create({
      userId: newUser.id,
      code,
    });

    await sendEmail({
      to: newUser.email,
      subject: "Account Activation Code - Edraak Plus",
      text: `Your account activation code is: ${code}`,
      html: `<p>Your account activation code is: <strong>${code}</strong></p>`,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message:
        "Registration successful. Please activate your account using the code sent to your email.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
      },
      token,
    });
  }
);

// @route POST
// @route /api/auth/verify-account
export const verifyAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, code } = req.body;

    const record = await VerificationCode.findOne({ where: { userId, code } });

    if (!record) {
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.isActive = true;
    await user.save();
    await record.destroy();

    res
      .status(200)
      .json({ message: "Account has been successfully activated" });
  }
);

// @desc    Signin user
// @route   POST /api/auth/signin
// @access  Public
export const Signin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const existingUser = await User.findOne({ where: { email } });
  if (!existingUser) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  if (!existingUser.isActive) {
    res.status(403).json({ message: "Please verify your account first" });
    return;
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const token = jwt.sign(
    { id: existingUser.id, role: existingUser.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: "Signin successful",
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      isActive: true,
    },
    token,
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
});

// @desc    Send password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const sendResetPasswordLink = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Please enter your email address" });
      return;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "This email is not registered with us" });
      return;
    }

    let existingToken = await PasswordResetToken.findOne({
      where: { userId: user.id },
    });

    if (!existingToken) {
      const token = crypto.randomBytes(32).toString("hex");

      existingToken = await PasswordResetToken.create({
        userId: user.id,
        token,
      });
    }

    const resetLink = `http://localhost:8000/api/auth/reset-password/${user.id}/${existingToken.token}`;

    const html = `<p>Click the link below to reset your password:</p>
                  <a href="${resetLink}">${resetLink}</a>`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset - Edraak Plus Platform",
      html,
    });

    res.status(200).json({
      message: "Password reset link has been sent to your email.",
    });
  }
);

// @desc    Validate password reset link
// @route   GET /api/auth/reset-password/:userId/:token
// @access  Public
export const validateResetPasswordLink = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, token } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = await PasswordResetToken.findOne({
      where: { userId: user.id, token },
    });

    if (!resetToken) {
      res.status(400).json({ message: "Invalid or expired link" });
      return;
    }

    res
      .status(200)
      .json({ message: "Valid link. You can reset your password." });
  }
);

// @desc    Save new password
// @route   POST /api/auth/reset-password/:userId/:token
// @access  Public
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = await PasswordResetToken.findOne({
      where: { userId: user.id, token },
    });

    if (!resetToken) {
      res.status(400).json({ message: "Invalid or expired link" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();
    await resetToken.destroy();

    res.status(200).json({ message: "Password has been changed successfully" });
  }
);
