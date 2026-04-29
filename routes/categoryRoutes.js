import express from "express";
import { singleUpload } from "../middlewares/multer.js";

import {
  createCategory,
  getAllCategoriesController,
  deleteCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";

//rroutes
const router = express.Router();

// ============== CAT ROUTES ==================

// CREATE CATEGORY
router.post("/create", isAuthenticated, createCategory);

// GET ALL CATEGORY
router.get("/get-all", getAllCategoriesController);

// DELETE  CATEGORY
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAdmin,
  deleteCategoryController,
);

// UPDATE ALL CATEGORY
router.put("/update/:id", isAuthenticated, isAdmin, updateCategoryController);
export default router;
