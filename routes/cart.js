import express from "express";
import Cart from "../model/cart.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();


// ==========================
// ✅ GET USER CART
// ==========================
router.get("/", authMiddleware, async (req, res) => {

  try {

    let cart = await Cart.findOne({
      userId: req.userId,
    });

    // ✅ Agar cart nahi mila
    if (!cart) {

      cart = new Cart({
        userId: req.userId,
        products: [],
      });

      await cart.save();

    }

    res.json(cart);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to fetch cart",
    });

  }

});


// ==========================
// ✅ ADD TO CART
// ==========================
router.post("/add", authMiddleware, async (req, res) => {

  try {

    const product = req.body;

    let cart = await Cart.findOne({
      userId: req.userId,
    });

    // ✅ Agar cart nahi hai
    if (!cart) {

      cart = new Cart({
        userId: req.userId,
        products: [],
      });

    }

    // ✅ Existing item check
    const existingProduct = cart.products.find(
      (item) => item.productId === product.productId
    );

    // ✅ Quantity increase
    if (existingProduct) {

      existingProduct.quantity += 1;

    } else {

      cart.products.push({

        productId: product.productId,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,

      });

    }

    await cart.save();

    res.json({

      message: "Product added to cart",
      cart,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Add to cart failed",
    });

  }

});


// ==========================
// ✅ INCREASE QUANTITY
// ==========================
router.put("/increase/:productId", authMiddleware, async (req, res) => {

  try {

    const cart = await Cart.findOne({
      userId: req.userId,
    });

    if (!cart) {

      return res.status(404).json({
        message: "Cart not found",
      });

    }

    const item = cart.products.find(
      (item) => item.productId === req.params.productId
    );

    if (item) {

      item.quantity += 1;

    }

    await cart.save();

    res.json({

      message: "Quantity increased",
      products: cart.products,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Increase failed",
    });

  }

});


// ==========================
// ✅ DECREASE QUANTITY
// ==========================
router.put("/decrease/:productId", authMiddleware, async (req, res) => {

  try {

    const cart = await Cart.findOne({
      userId: req.userId,
    });

    if (!cart) {

      return res.status(404).json({
        message: "Cart not found",
      });

    }

    const item = cart.products.find(
      (item) => item.productId === req.params.productId
    );

    if (item) {

      // ✅ Quantity decrease
      if (item.quantity > 1) {

        item.quantity -= 1;

      } else {

        // ✅ Quantity 1 ho to remove
        cart.products = cart.products.filter(
          (p) => p.productId !== req.params.productId
        );

      }

    }

    await cart.save();

    res.json({

      message: "Quantity decreased",
      products: cart.products,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Decrease failed",
    });

  }

});


// ==========================
// ✅ REMOVE ITEM
// ==========================
router.delete("/remove/:productId", authMiddleware, async (req, res) => {

  try {

    const { productId } = req.params;

    const cart = await Cart.findOne({
      userId: req.userId,
    });

    if (!cart) {

      return res.status(404).json({
        message: "Cart not found",
      });

    }

    cart.products = cart.products.filter(
      (item) => item.productId !== productId
    );

    await cart.save();

    res.json({

      message: "Item removed",
      cart,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Remove failed",
    });

  }

});


// ==========================
// ✅ CLEAR CART
// ==========================
router.delete("/clear", authMiddleware, async (req, res) => {

  try {

    const cart = await Cart.findOne({
      userId: req.userId,
    });

    if (!cart) {

      return res.status(404).json({
        message: "Cart not found",
      });

    }

    cart.products = [];

    await cart.save();

    res.json({
      message: "Cart cleared",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Clear cart failed",
    });

  }

});

export default router;