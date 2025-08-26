import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import User from "../models/User";
import Evaluation from "../models/Evaluation";

// @desc    Create Evaluation for a student
// @route   POST /api/evaluation
// @access  Private
export const CreateEvaluation = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId, courseId, score, feedback } = req.body;

    if (!feedback || score == null) {
      res.status(400).json({ message: "Please enter feedback and score" });
      return;
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const student = await User.findByPk(studentId);
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    const newEvaluation = await Evaluation.create({
      studentId,
      courseId,
      score,
      feedback,
    });

    if (!Number.isInteger(score) || score < 1 || score > 10) {
      res.status(400).json({ message: "الدرجة يجب أن تكون رقمًا بين 1 و 10" });
    }

    res.status(201).json({
      message: "Evaluation created successfully",
      evaluation: newEvaluation,
    });
  }
);

// @desc    Update Evaluation to student
// @route   PUT /api/evaluation/:id
// @access  Private

export const UpdateEvaluation = asyncHandler(
  async (req: Request, res: Response) => {
    const { score, feedback } = req.body;
    const { id } = req.params;

    if (!feedback || !score) {
      res.status(400).json({ message: "please enter feedback and score" });
      return;
    }

    const [updated] = await Evaluation.update(req.body, {
      where: { id },
    });

    if (!updated) {
      res.status(404).json({
        message: "Evaluation not found",
      });
      return;
    }

    const FindEvaluation = await Evaluation.findByPk(id);
    res.status(200).json({
      message: "Evaluation updated successfully",
      FindEvaluation,
    });
  }
);

// @desc    Delete Evaluation
// @route   DELETE /api/evaluation/:id
// @access  Private
export const DeleteEvaluation = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const evaluation = await Evaluation.findByPk(id);
    if (!evaluation) {
      res.status(404).json({ message: "Evaluation not found" });
      return;
    }

    await evaluation.destroy();

    res.status(200).json({ message: "Evaluation deleted successfully" });
  }
);

// @desc    Get All Evaluations
// @route   GET /api/evaluation
// @access  Private
export const GetAllEvaluations = asyncHandler(
  async (req: Request, res: Response) => {
    const evaluations = await Evaluation.findAll();
    if (!evaluations) {
      res.status(404).json({ message: "Not exist evaluations " });
      return;
    }
    res.status(200).json({ evaluations });
  }
);

// @desc    Get Evaluation by Student ID
// @route   GET /api/evaluation/student/:studentId
// @access  Private
export const GetEvaluationByStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;

    const evaluations = await Evaluation.findAll({ where: { studentId } });
    if (!evaluations) {
      res
        .status(404)
        .json({ message: "Not Founded  evaluations by studentId" });
    }
    res.status(200).json({ evaluations });
  }
);

// @desc    Get Evaluation by Course ID
// @route   GET /api/evaluation/course/:courseId
// @access  Private
export const GetEvaluationByCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId } = req.params;

    const evaluations = await Evaluation.findAll({ where: { courseId } });
    if (!evaluations) {
      res.status(404).json({ message: "Not Founded  evaluations by courseId" });
    }
    res.status(200).json({ evaluations });
  }
);
