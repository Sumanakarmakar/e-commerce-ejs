const express = require("express");
const routeLabel = require("route-label");
const UserAuthCheck = require("../../middleware/userAuth");
const productHomeController = require("../../modules/product/controller/frontend/productHome.controller");
const userHomeController = require("../../modules/user/controller/frontend/userHome.controller");

const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.all("/product*", UserAuthCheck, userHomeController.authcheckUser)

namedRouter.get(
  "product.page",
  "/product/list",
  productHomeController.allProductsPage
);
namedRouter.get(
  "product.details.page",
  "/product/details/:id",
  productHomeController.getProductDetailsPage
);
namedRouter.get(
  "category.wiseproduct.page",
  "/product/category-wise-products/:id",
  productHomeController.getCategoryWiseProducts
);
namedRouter.get(
  "product.search",
  "/product/search",
  productHomeController.searchProducts
);

module.exports = Router;
