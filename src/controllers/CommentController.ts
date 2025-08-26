import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Comment from "../models/Comment";
import User from "../models/User";
import Lesson from "../models/Lesson";

// @desc    Create new comment in lesson
// @route   POST /api/comment
// @access  Public

export const CreateComment = asyncHandler(
  async (req: Request, res: Response) => {
    //  destructuring
    const { userId, lessonId, content } = req.body;

    if (!content) {
      res.status(400).json({ message: "Content is required" });
      return;
    }

    const findUser = await User.findByPk(userId);
    if (!findUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const findLesson = await Lesson.findByPk(lessonId);
    if (!findLesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    const newComment = await Comment.create({
      content,
      userId,
      lessonId,
    });

    res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
    });
  }
);

// @desc    Get  comment in lesson
// @route   POST /api/comment
// @access  Public

export const GetComment = asyncHandler(async (req: Request, res: Response) => {
  const GetComment = await Comment.findAll();
  if (!GetComment) {
    res.status(404).json({ message: "Not Found User" });
  }
  res.status(201).json({ message: "founded Comment successful", GetComment });
});

// @desc    Get  comment in lesson by id
// @route   POST /api/comment
// @access  Public

export const GetCommentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const GetCommentById = await Comment.findByPk(id);
    if (!GetCommentById) {
      res.status(404).json({ message: "Not Found User By Id" });
    }
    res
      .status(201)
      .json({ message: "founded Comment successful", GetCommentById });
  }
);

// @desc    count  comment
// @route   POST /api/comment
// @access  Public

export const CountComment = asyncHandler(
  async (req: Request, res: Response) => {
    const CountComment = await Comment.count();

    res.status(201).json({ message: "Count Comment successful", CountComment });
  }
);

// @desc    Get  comment in lesson by id
// @route   POST /api/comment
// @access  Public

export const DeleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const CommentById = await Comment.findByPk(id);
    if (!CommentById) {
      res.status(404).json({ message: "Not Found User By Id" });
    }

    await Comment.destroy({
      where: {
        id,
      },
    });
    res.status(201).json({ message: "Delete Comment successful" });
  }
);

// @desc    Update comment content
// @route   PATCH /api/comments/:id
// @access  Private (owner or admin)

export const UpdateComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ message: "Content is required to update" });
      return;
    }

    const [updatedCount] = await Comment.update({ content }, { where: { id } });

    if (updatedCount === 0) {
      res.status(404).json({ message: "Comment not found or no changes made" });
      return;
    }

    const updatedComment = await Comment.findByPk(id);

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  }
);
