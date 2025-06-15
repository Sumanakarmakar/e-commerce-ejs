const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "category"
    },
    image: {
        type: [String],
        default: "image"
    },
  },
  {
    timestamps: true,
    versionKey: 0,
  }
);

const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
