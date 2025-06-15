const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  quantity: {
    type: Number,
  },
  pricePerUnit: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
});

const CartSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cartItems: [CartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
    isCheckedOut: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: 0,
  }
);

const CartModel = mongoose.model("cart", CartSchema);
module.exports = CartModel;
