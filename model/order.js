import express from "express";
import Order from "../model/order.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================
// ✅ GET ORDERS
// ==========================
router.get("/", authMiddleware, async (req, res) => {

  try {

    let userOrders = await Order.findOne({
      userId: req.userId,
    });

    // Agar first time user hai
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

    console.log(err);

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

    // Agar user ka order doc nahi hai
    if (!userOrders) {

      userOrders = new Order({
        userId: req.userId,
        orders: [],
      });

    }

    // Duplicate check
    const alreadyExists = userOrders.orders.find(
      (order) => order.id === newOrder.id
    );

    if (alreadyExists) {

      return res.json({
        message: "Order already exists",
        orders: userOrders.orders,
      });

    }

    // New order add
    userOrders.orders.unshift(newOrder);

    await userOrders.save();

    res.json({
      message: "Order placed",
      orders: userOrders.orders,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to add order",
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

    const userOrders = await Order.findOne({
      userId: req.userId,
    });

    if (!userOrders) {

      return res.status(404).json({
        message: "Orders not found",
      });

    }

    // Find order
    const order = userOrders.orders.find(
      (o) => o.id === orderId
    );

    if (!order) {

      return res.status(404).json({
        message: "Order not found",
      });

    }

    // Update status
    order.status = status;

    await userOrders.save();

    res.json({
      message: "Order status updated",
      orders: userOrders.orders,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to update status",
    });

  }

});

export default router;