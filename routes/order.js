import express from "express";
import Order from "../model/order.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();


// ==========================
// ✅ GET ORDERS
// ==========================
router.get("/", authMiddleware, async (req, res) => {

  try {

    let orderData = await Order.findOne({
      userId: req.userId,
    });

    // ✅ First time user
    if (!orderData) {

      orderData = new Order({
        userId: req.userId,
        orders: [],
      });

      await orderData.save();

    }

    res.json({
      orders: orderData.orders,
    });

  } catch (err) {

    console.log("GET ORDER ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch orders",
    });

  }

});


// ==========================
// ✅ PLACE ORDER
// ==========================
router.post("/add", authMiddleware, async (req, res) => {

  try {

    const newOrder = req.body;

    let orderData = await Order.findOne({
      userId: req.userId,
    });

    // ✅ Create if not exists
    if (!orderData) {

      orderData = new Order({
        userId: req.userId,
        orders: [],
      });

    }

    // ✅ Prevent duplicate order
    const alreadyExists = orderData.orders.find(
      (item) => item.id === newOrder.id
    );

    if (alreadyExists) {

      return res.json({
        message: "Order already exists",
        orders: orderData.orders,
      });

    }

    // ✅ Add new order
    orderData.orders.unshift(newOrder);

    await orderData.save();

    res.json({
      message: "Order placed",
      orders: orderData.orders,
    });

  } catch (err) {

    console.log("ADD ORDER ERROR:", err);

    res.status(500).json({
      message: "Order failed",
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

    const orderData = await Order.findOne({
      userId: req.userId,
    });

    // ✅ Orders not found
    if (!orderData) {

      return res.status(404).json({
        message: "Orders not found",
      });

    }

    // ✅ Find order index safely
    const orderIndex = orderData.orders.findIndex(
      (item) => String(item.id) === String(orderId)
    );

    // ✅ Order not found
    if (orderIndex === -1) {

      return res.status(404).json({
        message: "Order not found",
      });

    }

    // ✅ Update status
    orderData.orders[orderIndex].status = status;

    await orderData.save();

    res.json({
      message: "Order updated",
      orders: orderData.orders,
    });

  } catch (err) {

    console.log("UPDATE ORDER ERROR:", err);

    res.status(500).json({
      message: "Update failed",
      error: err.message,
    });

  }

});

export default router;