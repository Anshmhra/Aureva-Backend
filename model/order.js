import express from "express";
import Order from "../model/order.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();


// ==========================
// ✅ GET ORDERS
// ==========================
router.get("/", authMiddleware, async (req, res) => {

  try {

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

    res.json({
      orders: userOrders.orders,
    });

  } catch (err) {

    console.log("GET ORDERS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch orders",
    });

  }

});


// ==========================
// ✅ ADD ORDER
// ==========================
router.post("/add", authMiddleware, async (req, res) => {

  try {

    const newOrder = req.body;

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

      return res.json({
        message: "Order already exists",
        orders: userOrders.orders,
      });

    }

    // ✅ Default pending status
    newOrder.status = "pending";

    // ✅ Add order
    userOrders.orders.unshift(newOrder);

    await userOrders.save();

    res.json({
      message: "Order placed",
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
    console.log("STATUS:", status);

    const userOrders = await Order.findOne({
      userId: req.userId,
    });

    // ✅ User orders not found
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

    await userOrders.save();

    res.json({
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