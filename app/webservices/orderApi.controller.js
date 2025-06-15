const sendSMS = require("../helper/sendSMS");
const orderRepositories = require("../modules/order/repositories/order.repositories");
const ProductModel = require("../modules/product/model/product.model");
const userRepositories = require("../modules/user/repositories/user.repositories");

class OrderApiController {
  async createOrder(req, res) {
    try {
      const { customerId, categoryId, orderItems, shippingAddress, status } =
        req.body;

      // Validate required fields
      if (
        !customerId ||
        !categoryId ||
        !orderItems ||
        orderItems.length === 0 ||
        !shippingAddress
      ) {
        return res.status(400).json({
          status: 400,
          message: "All fields are Required",
        });
      }

      // Calculate the total order price
      let orderPrice = 0;
      for (let item of orderItems) {
        if (item.productId) {
          const product = await ProductModel.findById(item.productId);
          if (product && product.price) {
            item.pricePerUnit = product.price;
            item.totalPrice = item.pricePerUnit * item.quantity; // Calculate totalPrice for the item
            orderPrice += item.totalPrice;
          } else {
            return res.status(400).json({
              status: 400,
              message: "Each order item must have a pricePerUnit and quantity.",
            });
          }
        } else {
          return res.status(400).json({
            status: 400,
            message: "Product not found",
          });
        }
      }

      // Create a new order document using the provided data
      const newOrderData = {
        customerId,
        categoryId,
        orderItems,
        shippingAddress,
        status: status || "confirmed", // Default status is "confirmed" if not provided
        orderPrice,
        orderDate: new Date(),
        deliveryDate: new Date(), // Assuming delivery date is set at the time of order creation, can be updated later
      };

      // Save the order to the database
      const savedOrderData = await orderRepositories.newOrder(newOrderData);
      // console.log("order", savedOrderData);
      const user = await userRepositories.findById(savedOrderData.customerId);
      // console.log("user", user);

      // Send a response indicating the order has been successfully created
      if (savedOrderData) {
        sendSMS(
          user,
          "Your E-Store order is placed successfully & it is confirmed order"
        );
        return res.status(201).json({
          status: 200,
          message: "Your Order is successfully placed",
          data: savedOrderData,
        });
      }
    } catch (error) {
      console.log(`Error in creating order ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async getAllOrders(req, res) {
    try {
      const allOrderData = await orderRepositories.allOrders();
      if (allOrderData) {
        return res.status(200).json({
          status: 200,
          total: allOrderData.length,
          message: "All Orders Fetched Successfully",
          data: allOrderData,
        });
      }
    } catch (error) {
      console.log(`Error in getting all orders ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async getCustomerWiseOrders(req, res) {
    try {
      const customerWiseData = await orderRepositories.custWiseOrders(
        req.params.id
      );
      if (customerWiseData) {
        return res.status(200).json({
          status: 200,
          data: customerWiseData,
          message: "Customer wise data fetched successfully",
        });
      }
    } catch (error) {
      console.log(`Error in getting customer wise order details ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }
}

module.exports = new OrderApiController();
