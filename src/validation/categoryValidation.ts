import Joi from "joi";

export const CreateCategory = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(200).required(),
});

export const UpdataCategory = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(200).required(),
});
