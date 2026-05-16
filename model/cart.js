import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: String,

  products: [
    {
      productId: String,
      title: String,
      price: Number,
      image: String,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

export default mongoose.model("Cart", cartSchema);