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

    if (!orderData) {

      orderData = new Order({
        userId: req.userId,
        orders: [],
      });

      await orderData.save();

    }

    res.json(orderData);

  } catch (err) {

    console.log(err);

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

    if (!orderData) {

      orderData = new Order({
        userId: req.userId,
        orders: [],
      });

    }

    orderData.orders.unshift(newOrder);

    await orderData.save();

    res.json({
      message: "Order placed",
      orders: orderData.orders,
    });

  } catch (err) {

    console.log(err);

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

    if (!orderData) {

      return res.status(404).json({
        message: "Orders not found",
      });

    }

    const order = orderData.orders.find(
      (item) => item.id === orderId
    );

    if (!order) {

      return res.status(404).json({
        message: "Order not found",
      });

    }

    // ✅ STATUS UPDATE
    order.status = status;

    await orderData.save();

    res.json({
      message: "Order updated",
      orders: orderData.orders,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Update failed",
    });

  }

});

export default router;