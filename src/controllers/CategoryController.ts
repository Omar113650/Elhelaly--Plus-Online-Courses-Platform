import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Op } from "sequelize";
import Category from "../models/Category";

// @desc    Create new category
// @route   POST /api/categories
// @access  Public
export const createCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ message: "Category name is required" });
      return;
    }

    const category = await Category.create({ name, description });

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  }
);

// @desc    Get all categories with optional search & pagination
// @route   GET /api/categories?search=html&page=1&limit=10
// @access  Public
export const getAllCategories = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      search,
      page = "1",
      limit = "10",
    } = req.query as {
      search?: string;
      page?: string;
      limit?: string;
    };

    const offset = (Number(page) - 1) * Number(limit);

    const Search = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const categories = await Category.findAndCountAll({
      where: Search,
      limit: Number(limit),
      offset,
    });

    res.status(200).json({
      message: "Categories retrieved successfully",
      total: categories.count,
      categories: categories.rows,
    });
  }
);

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category retrieved", category });
  }
);

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Public
export const updateCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const [updatedCount] = await Category.update(req.body, { where: { id } });

    if (updatedCount === 0) {
      res
        .status(404)
        .json({ message: "Category not found or no changes made" });
      return;
    }

    const updatedCategory = await Category.findByPk(id);

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  }
);

// @desc    Delete category (hard delete)
// @route   DELETE /api/categories/:id
// @access  Public
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    await category.destroy();

    res.status(200).json({ message: "Category deleted successfully" });
  }
);

// @desc    Count total categories
// @route   GET /api/categories/count
// @access  Public
export const countCategories = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const count = await Category.count();
    res.status(200).json({ count });
  }
);
