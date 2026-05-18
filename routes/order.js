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

    // First time user
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

    // If doc not exists
    if (!userOrders) {

      userOrders = new Order({
        userId: req.userId,
        orders: [],
      });

    }

    // ✅ Default confirmed status
    newOrder.status = newOrder.status || "confirmed";

    // Add order
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

export default router;