import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import User from "../models/User";
import Enrollment from "../models/Enrollment";
import { Request, Response } from "express";
import "../models/associations";

export const RllRegister = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const RegisterCount = await User.count();
    res.json({ message: "all Register is...", RegisterCount });
  }
);


export const AllEnrollInCourse = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;

    const count = await Enrollment.count({ where: { courseId } });

    res.status(200).json({
      message: "Student enrolled is course ...",
      count,
    });
  }
);

export const HighEnrolInCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const HighEnrol = await Course.findAll({
      order: [["enrolledStudents", "DESC"]],
      limit: 5,
    });

    res.status(200).json({
      message: "High enrolled is course ...",
      HighEnrol,
    });
  }
);
