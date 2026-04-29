import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModels.js";

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const newCat = await categoryModel.create({ category });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// GET ALL
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});

    res.status(200).json({
      success: true,
      totalCategories: categories.length,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
export const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // remove category from products
    await productModel.updateMany(
      { category: category.category },
      { $unset: { category: "" } },
    );

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
export const updateCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { category: newName } = req.body;

    if (!newName) {
      return res.status(400).json({
        success: false,
        message: "New category name required",
      });
    }

    // update products
    await productModel.updateMany(
      { category: category.category },
      { category: newName },
    );

    category.category = newName;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated",
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
