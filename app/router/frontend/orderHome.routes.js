const express = require("express");
const routeLabel = require("route-label");
const UserAuthCheck = require("../../middleware/userAuth");
const orderHomeController = require("../../modules/order/controller/frontend/orderHome.controller");

const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.all("/order*", UserAuthCheck)

namedRouter.get(
  "order.cart.page",
  "/order/cart",
  orderHomeController.cartPage
);

module.exports = Router;
