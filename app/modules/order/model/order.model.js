const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
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

const ProductOrderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
    orderItems: {
      type: [OrderItemSchema],
    },
    shippingAddress: {
      type: String,
    },
    status: {
      type: String,
      enum: ["confirmed", "shipped", "delivered", "cancelled"],
      default: "confirmed",
    },
    orderPrice: {
      type: Number,
    },
    orderDate: {
      type: Date,
      default: Date.now(),
    },
    deliveryDate: {
      type: Date,
      default: Date.now(),
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: 0,
  }
);

const ProductOrderModel = mongoose.model("order", ProductOrderSchema);
module.exports = ProductOrderModel;
