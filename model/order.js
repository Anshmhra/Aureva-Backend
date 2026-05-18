import express from "express";
import Order from "../model/order.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();


// ==========================
// ✅ GET ORDERS
// ==========================
router.get("/", authMiddleware, async (req, res) => {

  try {

    // ✅ Find user orders
    let userOrders = await Order.findOne({
      userId: req.userId,
    });

    // ✅ First time user
    if (!userOrders) {

      userOrders = new Order({
        userId: req.userId,
        orders: [],
      });

      await userOrders.save();

    }

    // ✅ Send orders
    res.status(200).json({
      orders: userOrders.orders,
    });

  } catch (err) {

    console.log("GET ORDERS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: err.message,
    });

  }

});


// ==========================
// ✅ ADD ORDER
// ==========================
router.post("/add", authMiddleware, async (req, res) => {

  try {

    const newOrder = req.body;

    // ✅ Find user orders
    let userOrders = await Order.findOne({
      userId: req.userId,
    });

    // ✅ Create doc if not exists
    if (!userOrders) {

      userOrders = new Order({
        userId: req.userId,
        orders: [],
      });

    }

    // ✅ Prevent duplicate order
    const alreadyExists = userOrders.orders.find(
      (item) => String(item.id) === String(newOrder.id)
    );

    if (alreadyExists) {

      return res.status(200).json({
        message: "Order already exists",
        orders: userOrders.orders,
      });

    }

    // ✅ Default status
    newOrder.status = newOrder.status || "pending";

    // ✅ Add new order
    userOrders.orders.unshift(newOrder);

    // ✅ Save
    await userOrders.save();

    res.status(200).json({
      message: "Order placed successfully",
      orders: userOrders.orders,
    });

  } catch (err) {

    console.log("ADD ORDER ERROR:", err);

    res.status(500).json({
      message: "Failed to add order",
      error: err.message,
    });

  }

});


// ==========================
// ✅ UPDATE ORDER STATUS
// ==========================
router.put("/update/:orderId", authMiddleware, async (req, res) => {

  try {

    const { orderId } = req.params;
    const { status } = req.body;

    console.log("ORDER ID:", orderId);
    console.log("NEW STATUS:", status);

    // ✅ Find user orders
    const userOrders = await Order.findOne({
      userId: req.userId,
    });

    // ✅ Orders not found
    if (!userOrders) {

      return res.status(404).json({
        message: "Orders not found",
      });

    }

    // ✅ Find exact order
    const order = userOrders.orders.find(
      (item) => String(item.id) === String(orderId)
    );

    // ✅ Order not found
    if (!order) {

      return res.status(404).json({
        message: "Order not found",
      });

    }

    // ✅ Update status
    order.status = status;

    // ✅ Save updated orders
    await userOrders.save();

    res.status(200).json({
      message: "Order status updated successfully",
      orders: userOrders.orders,
    });

  } catch (err) {

    console.log("UPDATE STATUS ERROR:", err);

    res.status(500).json({
      message: "Failed to update order status",
      error: err.message,
    });

  }

});

export default router;