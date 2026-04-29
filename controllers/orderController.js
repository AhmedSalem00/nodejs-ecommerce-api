import orderModel from "../models/orderModel.js";
import productModel from "../models/productModels.js";
import { stripe } from "../server.js";

// CREATE ORDERS
export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;

    // 1) basic validation
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items found",
      });
    }

    // 2) create order first (pending state)
    const order = await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
      status: "Processing",
    });

    // 3) update stock safely
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];

      const product = await productModel.findById(item.product);

      // ❌ product not found
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      // ❌ insufficient stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`,
        });
      }

      // ✅ update stock
      product.stock -= item.quantity;
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error in Create Order API",
      error: error.message,
    });
  }
};

// GET ALL ORDERS
export const getMyOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate("user", "name email");
    res.status(200).send({
      success: true,
      message: "All Orders Fetched Successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get All Orders API",
      error,
    });
  }
};

// GET SINGLE ORDER INFO
export const singleOrderDetrailsController = async (req, res) => {
  try {
    // find orders
    const order = await orderModel.findById(req.params.id);
    //valdiation
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "no order found",
      });
    }
    res.status(200).send({
      success: true,
      message: "your order fetched",
      order,
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
  }
};

// ACCEPT PAYMENTS
export const paymentController = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    // validation
    if (!totalAmount || isNaN(totalAmount)) {
      return res.status(400).json({
        success: false,
        message: "Valid totalAmount is required",
      });
    }

    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(totalAmount) * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("Stripe Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error while creating payment intent",
      error: error.message,
    });
  }
};

// ========== ADMIN SECTION =============

// GET ALL ORDERS
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).send({
      success: true,
      message: "All Orders Data",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
  }
};

// CHANGE ORDER STATUS
export const changeOrderStatusController = async (req, res) => {
  try {
    // find order
    const order = await orderModel.findById(req.params.id);
    // validatiom
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "order not found",
      });
    }
    if (order.orderStatus === "processing") order.orderStatus = "shipped";
    else if (order.orderStatus === "shipped") {
      order.orderStatus = "deliverd";
      order.deliverdAt = Date.now();
    } else {
      return res.status(500).send({
        success: false,
        message: "order already deliverd",
      });
    }
    await order.save();
    res.status(200).send({
      success: true,
      message: "order status updated",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
  }
};
