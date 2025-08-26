import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Lesson from "../models/Lesson";
import { cloudinaryUpload, cloudinaryRemove } from "../utils/Cloudinary";
import { nodeGet, nodeSet, nodeDelete } from "../utils/cache/nodecache";

// @desc    Create new Lesson
// @route   POST /api/lesson
// @access  Public
export const CreateLesson = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, content, courseId, order } = req.body;

    if (!title || !req.file) {
      res.status(400).json({ message: "Title and video file are required" });
      return;
    }

    const uploaded = await cloudinaryUpload(req.file.buffer);
    if (!uploaded || !uploaded.secure_url) {
      res.status(500).json({ message: "Failed to upload video" });
      return;
    }

    const newLesson = await Lesson.create({
      title,
      content,
      courseId,
      order,
      video_url: uploaded.secure_url,
    });

    await nodeDelete("all_lessons");

    res.status(201).json({
      message: "Lesson created successfully",
      data: newLesson,
    });
  }
);

// @desc  Get Lesson
// @route   POST /api/lesson
// @access  Public

export const GetLesson = asyncHandler(async (req: Request, res: Response) => {
  const cacheKey = "all_lessons";
  const cachedData = await nodeGet(cacheKey);

  if (cachedData) {
    res.status(200).json({
      message: "Returned lessons from cache successfully",
      data: cachedData,
    });
  }

  const GetAllLesson = await Lesson.findAll();
  if (!GetAllLesson || GetAllLesson.length === 0) {
    res.status(404).json({ message: "No lessons exist" });
    return;
  }

  await nodeSet(cacheKey, GetAllLesson, 600); // 600ث
  res.status(200).json({
    message: "Returned lessons successfully",
    data: GetAllLesson,
  });
});

// @desc  update Lesson
// @route   POST /api/lesson
// @access  Public
export const UpdateLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    let videoUrl = lesson.video_url;

    if (req.file) {
      const uploadResult = await cloudinaryUpload(req.file.buffer);
      videoUrl = uploadResult.secure_url;
    }

    const { title, content, courseId, order } = req.body;

    await lesson.update({
      title: title ?? lesson.title,
      content: content ?? lesson.content,
      courseId: courseId ?? lesson.courseId,
      order: order ?? lesson.order,
      video_url: videoUrl,
    });

    await nodeDelete("all_lessons");

    res.status(200).json({ message: "Lesson updated successfully", lesson });
  }
);

// @desc  delete Lesson
// @route   delete /api/lesson
// @access  Public

export const DeleteLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    if (lesson.video_url) {
      const publicId = extractPublicId(lesson.video_url);
      if (publicId) await cloudinaryRemove(publicId);
    }

    await Lesson.destroy({ where: { id } });

    await nodeDelete("all_lessons");

    res.status(200).json({ message: "Lesson deleted successfully" });
  }
);

// @desc  count Lesson
// @route   get /api/lesson
// @access  Public

export const CountLesson = asyncHandler(async (req: Request, res: Response) => {
  const countLesson = await Lesson.count();

  if (!countLesson) {
    res.status(404).json({ message: "No lessons exist" });
    return;
  }

  res
    .status(200)
    .json({ message: "Returned lessons successfully", countLesson });
});

const extractPublicId = (url: string): string | null => {
  try {
    const parts = url.split("/");
    const fileWithExtension = parts[parts.length - 1];
    const publicId = fileWithExtension.split(".")[0];
    const folder = parts.slice(parts.length - 2, parts.length - 1)[0];
    return `${folder}/${publicId}`;
  } catch {
    return null;
  }
};
