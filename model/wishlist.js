import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({

  userId: String,

  products: [

    {
      id: String,
      title: String,
      price: Number,
      image: String,
    },

  ],

});

export default mongoose.model("Wishlist", wishlistSchema);