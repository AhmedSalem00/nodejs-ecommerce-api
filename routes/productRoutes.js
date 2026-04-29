import express from "express";
import {
  getAllProductsController,
  getProductByIdController,
  createProductController,
} from "../controllers/productController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routes
router.get("/all-products", getAllProductsController);

//get product by id
router.get("/:id", getProductByIdController);

//create product
router.post("/create-product", isAuthenticated, createProductController);

export default router;
