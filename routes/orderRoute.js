import express from "express";
import { isAdmin, isAuthenticated } from "./../middlewares/authMiddleware.js";
import {
  //   changeOrderStatusController,
  createOrderController,
  getMyOrdersController,
  getAllOrdersController,
  paymentController,
  singleOrderDetrailsController,
  changeOrderStatusController,
} from "../controllers/orderController.js";
import Stripe from "stripe";

const router = express.Router();

//rroutes
// ============== ORDERS ROUTES ==================

// CREATE ORDERS
router.post("/create", isAuthenticated, createOrderController);

// //  GET ALL ORDERS
router.get("/my-orders", isAuthenticated, getMyOrdersController);

// //  GET SINGLE ORDER DETAILS
router.get("/my-orders/:id", isAuthenticated, singleOrderDetrailsController);

// // acceipt payments
router.post("/payments", isAuthenticated, paymentController);

// /// ======== ADMIN PART ============
// // get all order
router.get(
  "/admin/get-all-orders",
  isAdmin,
  isAuthenticated,
  getAllOrdersController,
);

// // change order status
router.put("/admin/order/:id", isAuthenticated, changeOrderStatusController);

// ====================================================================

export default router;
