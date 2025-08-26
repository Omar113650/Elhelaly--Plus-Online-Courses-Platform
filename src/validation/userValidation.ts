import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  email: Joi.string().email().required(),
  password: passwordComplexity().required(),
  role: Joi.string().valid("admin", "teacher", "student").optional(),
  isActive: Joi.boolean().optional(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  email: Joi.string().email().optional(),
  password: passwordComplexity().optional(),
  role: Joi.string().valid("admin", "teacher", "student").optional(),
  isActive: Joi.boolean().optional(),
});

export const changeRoleSchema = Joi.object({
  newRole: Joi.string().valid("admin", "teacher", "student").required(),
});

export const countByRoleSchema = Joi.object({
  role: Joi.string().valid("admin", "teacher", "student").required(),
});

export const RegisterValidate = Joi.object({
  name: Joi.string().min(3).max(100),
  email: Joi.string().email().required(),
  password: passwordComplexity().required(),
  role: Joi.string().valid("admin", "teacher", "student").optional(),
});

export const LoginValidate = Joi.object({
  email: Joi.string().email().optional(),
  password: passwordComplexity().optional(),
});

export const NewPasswordValidate = Joi.object({
  password: passwordComplexity().optional(),
});
