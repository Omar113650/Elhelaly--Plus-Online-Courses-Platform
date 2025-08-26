import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Op } from "sequelize";
import User from "../models/User";
import bcrypt from "bcrypt";

// @desc    Get all users with optional search & pagination
// @route   GET /api/user
// @access  Public
export const GetUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      page = "1",
      limit = "10",
      search,
    } = req.query as {
      page?: string;
      limit?: string;
      search?: string;
    };

    const offset = (Number(page) - 1) * Number(limit);

    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const users = await User.findAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      attributes: { exclude: ["password"] },
    });

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json({ message: "Users retrieved successfully", users });
  }
);

// @desc    Get user by ID
// @route   GET /api/user/:id
// @access  Public
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json({ message: "User retrieved", user });
});

// @desc    Get users by role
// @route   GET /api/user/role/:role
// @access  Public
export const getUsersByRole = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { role } = req.params;

    if (!["admin", "teacher", "student"].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const users = await User.findAll({ where: { role } });

    res.status(200).json({ message: `${role} users retrieved`, users });
  }
);

// @desc    Create user
// @route   POST /api/user
// @access  Public
export const CreateUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id, name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      id,
      name,
      email,
      password: hashedPassword,
      role,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  }
);

// @desc    Update user
// @route   PUT /api/user/:id
// @access  Public
export const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const [updatedCount] = await User.update(req.body, { where: { id } });

    if (updatedCount === 0) {
      res.status(404).json({ message: "User not found or no changes made" });
      return;
    }

    const updatedUser = await User.findByPk(id);

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  }
);

// @desc    Soft delete user (set isActive: false)
// @route   DELETE /api/user/:id
// @access  Public
export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.setDataValue("isActive", false);
    await user.save();

    res.status(200).json({ message: "User deactivated successfully" });
  }
);

// @desc    Change user role
// @route   PATCH /api/user/change-role/:id
// @access  Public
export const changeUserRole = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { newRole } = req.body;

    if (!["admin", "teacher", "student"].includes(newRole)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: "User role updated", user });
  }
);

// @desc    Count users by role
// @route   GET /api/user/count
// @access  Public
export const countUsersByRole = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { role } = req.body;

    const userCount = await User.count({ where: { role } });

    res
      .status(200)
      .json({ message: `Counted users with role: ${role}`, count: userCount });
  }
);

// @desc    Get overall user statistics
// @route   GET /api/user/stats
// @access  Public
export const getUserStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const total = await User.count();
    const active = await User.count({ where: { isActive: true } });
    const inactive = await User.count({ where: { isActive: false } });
    const students = await User.count({ where: { role: "student" } });
    const teachers = await User.count({ where: { role: "teacher" } });
    const admins = await User.count({ where: { role: "admin" } });

    res.status(200).json({
      total,
      active,
      inactive,
      students,
      teachers,
      admins,
    });
  }
);
