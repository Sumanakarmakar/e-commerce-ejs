const { default: mongoose } = require("mongoose");
const ProductOrderModel = require("../model/order.model");

class OrderRepositories {
  async newOrder(data) {
    try {
      const result = await ProductOrderModel.create(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async allOrders() {
    try {
      const result = await ProductOrderModel.aggregate([
        {
          $match: { isDeleted: false },
        },
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: "$customer",
        },
        {
          $unwind: "$orderItems", // Unwind the orderItems array so we can look up product details for each item
        },
        {
          $lookup: {
            from: "products", // Lookup in the "products" collection
            localField: "orderItems.productId", // Match on productId inside orderItems
            foreignField: "_id", // Match with _id field in products
            as: "productDetails", // Alias for the matched product documents
          },
        },
        {
          $unwind: {
            path: "$productDetails",
            preserveNullAndEmptyArrays: true,
          }, // Unwind the productDetails array
        },
        {
          $group: {
            _id: "$_id", // Group by order ID (so each order remains as one document)
            customerId: { $first: "$customerId" },
            customer: { $first: "$customer" },
            orderItems: { $push: "$orderItems" }, // Reconstruct orderItems array
            shippingAddress: { $first: "$shippingAddress" },
            status: { $first: "$status" },
            orderPrice: { $first: "$orderPrice" },
            orderDate: { $first: "$orderDate" },
            deliveryDate: { $first: "$deliveryDate" },
            productDetails: { $push: "$productDetails" }, // Push product details into orderItems
          },
        },
        {
          $project: {
            customerId: 1,
            customer: 1,
            orderItems: 1,
            shippingAddress: 1,
            status: 1,
            orderPrice: 1,
            orderDate: 1,
            deliveryDate: 1,
            productDetails: 1,
            // productDetails: {
            //     name: "$productDetails.title",  // Extract product name (or other details) from productDetails
            //     price: "$productDetails.price"
            // }
          },
        },
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async custWiseOrders(id) {
    try {
      const result = await ProductOrderModel.aggregate([
        { $match: { customerId: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: {
            path: "$productDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id", // Group by order ID (so each order remains as one document)
            customerId: { $first: "$customerId" },
            orderItems: { $first: "$orderItems" }, // Reconstruct orderItems array
            shippingAddress: { $first: "$shippingAddress" },
            status: { $first: "$status" },
            orderPrice: { $first: "$orderPrice" },
            orderDate: { $first: "$orderDate" },
            deliveryDate: { $first: "$deliveryDate" },
            productDetails: { $push: "$productDetails" }, // Push product details into orderItems
          },
        },
        {
          $project: {
            customerId: 1,
            orderItems: 1,
            shippingAddress: 1,
            status: 1,
            orderPrice: 1,
            orderDate: 1,
            deliveryDate: 1,
            productDetails: 1,
          },
        },
      ]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }

  async updateOrderStatus(id, data) {
    try {
       const result=await ProductOrderModel.findByIdAndUpdate(id, data)
       return result;
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = new OrderRepositories();
