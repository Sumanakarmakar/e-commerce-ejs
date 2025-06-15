const express = require("express");
const routeLabel = require("route-label");
const AuthCheck = require("../../middleware/authForApi");
const orderApiController = require("../../webservices/orderApi.controller");
const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.all("/order*", AuthCheck);

namedRouter.post(
  "order.create",
  "/order/create",
  orderApiController.createOrder
);
namedRouter.get(
  "order.all",
  "/order/list",
  orderApiController.getAllOrders
);
namedRouter.get(
  "order.customer.wise",
  "/order/customer-wise/:id",
  orderApiController.getCustomerWiseOrders
);


module.exports = Router;
