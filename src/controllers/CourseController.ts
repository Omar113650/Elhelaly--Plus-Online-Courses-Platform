import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Op } from "sequelize";
import Course from "../models/Course";

// @desc    Create new Course
// @route   POST /api/courses
// @access  Public
export const CreateCourse = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      title,
      description,
      teacherId,
      categoryId,
      rating,
      price,
      durationInHours,
    } = req.body;

    if (!title || !teacherId || !categoryId || !durationInHours) {
      res.status(400).json({
        message:
          "Required fields: title, teacherId, categoryId, durationInHours",
      });
      return;
    }

    const newCourse = await Course.create({
      title,
      description,
      teacherId,
      categoryId,
      rating,
      price,
      durationInHours,
    });

    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  }
);

// @desc    Get all courses with optional sorting and search
// @route   GET /api/courses
// @access  Public
export const GetAllCourses = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      sort,
      search,
      limit = "10",
      page = "1",
    } = req.query as {
      sort?: string;
      search?: string;
      limit?: string;
      page?: string;
    };

    const order: any =
      sort === "rating"
        ? [["rating", "DESC"]]
        : sort === "latest"
        ? [["createdAt", "DESC"]]
        : [];

    const offset = (Number(page) - 1) * Number(limit);

    const whereClause = search
      ? {
          title: { [Op.like]: `%${search}%` },
        }
      : {};

    const courses = await Course.findAll({
      where: whereClause,
      order,
      limit: Number(limit),
      offset,
    });

    if (!courses || courses.length === 0) {
      res.status(404).json({ message: "No courses found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Courses retrieved successfully", courses });
  }
);

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const GetCourseById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.status(200).json({ message: "Course retrieved successfully", course });
  }
);

// @desc    Delete course by ID
// @route   DELETE /api/courses/:id
// @access  Public
export const DeleteCourse = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    await course.destroy();

    res.status(200).json({ message: "Course deleted successfully" });
  }
);

// @desc    Update course by ID
// @route   PUT /api/courses/:id
// @access  Public
export const UpdateCourse = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const [updatedCount] = await Course.update(req.body, { where: { id } });

    if (updatedCount === 0) {
      res.status(404).json({ message: "Course not found or no changes made" });
      return;
    }

    const updatedCourse = await Course.findByPk(id);

    res
      .status(200)
      .json({ message: "Course updated successfully", course: updatedCourse });
  }
);

// @desc    Count total courses
// @route   GET /api/courses/count
// @access  Public
export const CountCourses = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const count = await Course.count();
    res.status(200).json({ count });
  }
);

// @desc    Get top 5 courses by rating
// @route   GET /api/courses/top
// @access  Public
export const GetTopCourses = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const topCourses = await Course.findAll({
      order: [["rating", "DESC"]],
      limit: 5,
    });

    res
      .status(200)
      .json({ message: "Top courses retrieved", courses: topCourses });
  }
);
