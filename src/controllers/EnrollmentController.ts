import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";
import User from "../models/User";
import "../models/associations";
import dayjs from "dayjs";
import * as ExcelJS from "exceljs";
import { writeToString } from "@fast-csv/format";

// @desc    Enroll user in course
// @route   POST /api/courses/:id/enroll
// @access  Public
export const EnrollInCourse = asyncHandler(
  async (
    req: Request & { user?: { id: number } },
    res: Response
  ): Promise<void> => {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: userId not found" });
      return;
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const alreadyEnrolled = await Enrollment.findOne({
      where: { userId, courseId: course.id },
    });

    if (alreadyEnrolled) {
      res.status(400).json({ message: "User already enrolled in this course" });
      return;
    }

    await Enrollment.create({ courseId: course.id, userId });

    course.enrolledStudents = (course.enrolledStudents || 0) + 1;
    await course.save();

    res.status(200).json({
      message: "Student enrolled successfully",
      course,
    });
  }
);

// @desc    Get all courses a user is enrolled in (with progress)
// @route   GET /api/enrollments/user/:userId
// @access  Public

export const GetUserEnrollments = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    const enrollments = await Enrollment.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title", "description", "categoryId"],
        },
      ],
    });

    if (!enrollments.length) {
      res.status(404).json({ message: "User not enrolled in any course" });
      return;
    }

    const result = enrollments.map((enroll) => ({
      course: enroll.courseId,
      progress: enroll.progress,
      isCompleted: enroll.isCompleted,
      enrolledAt: enroll.createdAt,
    }));

    res.status(200).json({
      message: "Enrollments retrieved successfully",
      enrollments: result,
    });
  }
);

// @desc   Cancel specific enrollment
// @route  DELETE /api/enrollments/:enrollmentId
// @access Public
export const CancelEnrollment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findByPk(enrollmentId);
    if (!enrollment) {
      res.status(404).json({ message: "Enrollment not found" });
      return;
    }
    await enrollment.destroy();
    res.status(200).json({ message: "Enrollment canceled successfully" });
  }
);

// @desc   Delete all enrollments of a user
// @route  DELETE /api/enrollments/user/:userId
// @access Public
export const DeleteEnrollments = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    const enrollments = await Enrollment.findAll({
      where: { userId },
    });

    if (!enrollments.length) {
      res.status(404).json({ message: "User not enrolled in any course" });
      return;
    }

    await Enrollment.destroy({ where: { userId } });

    res.status(200).json({
      message: "All enrollments deleted successfully",
    });
  }
);

// @desc   Export enrollments of a course as CSV
// @route  GET /api/courses/:courseId/enrollments/export
// @access Public
export const ExportEnrollmentsCSV = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;

    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!enrollments.length) {
      res.status(404).json({ message: "No enrollments found for this course" });
      return;
    }

    const csvData = enrollments.map((enroll) => ({
      StudentID: enroll.student?.id ?? "N/A",
      Name: enroll.student?.name ?? "N/A",
      Email: enroll.student?.email ?? "N/A",
      EnrolledAt: enroll.createdAt,
    }));

    const csv = await writeToString(csvData, { headers: true });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=enrollments_course_${courseId}.csv`
    );
    res.status(200).send(csv);
  }
);

// @desc   Export enrollments of a course as Excel
// @route  GET /api/courses/:courseId/enrollments/export-excel
// @access Public
export const ExportEnrollmentsExcel = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;

    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!enrollments.length) {
      res.status(404).json({ message: "No enrollments found for this course" });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Enrollments");

    worksheet.columns = [
      { header: "StudentID", key: "id", width: 12 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "EnrolledAt", key: "enrolledAt", width: 20 },
    ];

    enrollments.forEach((enroll) => {
      worksheet.addRow({
        id: enroll.student?.id ?? "N/A",
        name: enroll.student?.name ?? "N/A",
        email: enroll.student?.email ?? "N/A",
        enrolledAt: dayjs(enroll.createdAt).format("YYYY-MM-DD HH:mm"),
      });
    });

    res.setHeader("Content-Disposition", `attachment; filename="..."`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  }
);
