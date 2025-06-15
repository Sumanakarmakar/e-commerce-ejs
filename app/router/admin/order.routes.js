const express = require("express");
const routeLabel = require("route-label");
const userController = require("../../modules/user/controller/backend/user.controller");
const AdminAuthCheck = require("../../middleware/adminAuth");
const orderController = require("../../modules/order/controller/backend/order.controller");
const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.all("/order*", AdminAuthCheck, userController.authcheckUser);

namedRouter.get(
  "order.all",
  "/order/list",
  orderController.getAllOrders
);
namedRouter.get(
  "order.customer.wise",
  "/order/customer-wise/:id",
  orderController.getCustomerWiseOrders
);

module.exports = Router;
