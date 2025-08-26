import Joi from "joi";

export const createCourseSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().required(),
  teacherId: Joi.number().required(),
  categoryId: Joi.number().required(),
  rating: Joi.number().min(0).max(5).optional(),
  price: Joi.number().min(0).optional(),
  durationInHours: Joi.number().positive().required(),
  enrolledStudents: Joi.number().integer().min(0).optional(),
  ratingCount: Joi.number().integer().min(0).optional(),
});

export const updateCourseSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  description: Joi.string().optional(),
  teacherId: Joi.number().optional(),
  categoryId: Joi.number().optional(),
  rating: Joi.number().min(0).max(5).optional(),
  price: Joi.number().min(0).optional(),
  durationInHours: Joi.number().positive().optional(),
  enrolledStudents: Joi.number().integer().min(0).optional(),
  ratingCount: Joi.number().integer().min(0).optional(),
});
