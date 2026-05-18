import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  userId: String,

  orders: [

    {

      id: String,

      status: {
        type: String,
        default: "confirmed",
      },

      date: String,

      total: Number,

      address: String,

      items: [

        {

          id: String,
          title: String,
          price: Number,
          quantity: Number,
          image: String,

        },

      ],

    },

  ],

});

export default mongoose.model("Order", orderSchema);