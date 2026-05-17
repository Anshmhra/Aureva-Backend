import express from "express";
import Wishlist from "../model/wishlist.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const router = express.Router();


// ==========================
// ✅ GET WISHLIST
// ==========================
router.get("/", authMiddleware, async (req, res) => {

  try {

    let wishlist = await Wishlist.findOne({
      userId: req.userId,
    });

    if (!wishlist) {

      wishlist = new Wishlist({
        userId: req.userId,
        products: [],
      });

      await wishlist.save();

    }

    res.json(wishlist);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to fetch wishlist",
    });

  }

});


// ==========================
// ✅ ADD TO WISHLIST
// ==========================
router.post("/add", authMiddleware, async (req, res) => {

  try {

    const product = req.body;

    let wishlist = await Wishlist.findOne({
      userId: req.userId,
    });

    if (!wishlist) {

      wishlist = new Wishlist({
        userId: req.userId,
        products: [],
      });

    }

    const existingProduct = wishlist.products.find(
      (item) => item.id === product.id
    );

    if (!existingProduct) {

      wishlist.products.push({

        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,

      });

    }

    await wishlist.save();

    res.json({
      message: "Added to wishlist",
      wishlist,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Wishlist add failed",
    });

  }

});


// ==========================
// ✅ REMOVE FROM WISHLIST
// ==========================
router.delete("/remove/:id", authMiddleware, async (req, res) => {

  try {

    const wishlist = await Wishlist.findOne({
      userId: req.userId,
    });

    if (!wishlist) {

      return res.status(404).json({
        message: "Wishlist not found",
      });

    }

    wishlist.products = wishlist.products.filter(
      (item) => item.id !== req.params.id
    );

    await wishlist.save();

    res.json({
      message: "Removed from wishlist",
      products: wishlist.products,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Remove failed",
    });

  }

});

export default router;