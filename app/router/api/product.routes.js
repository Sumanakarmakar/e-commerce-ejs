const express = require("express");
const routeLabel = require("route-label");
const AuthCheck = require("../../middleware/authForApi");
const {
  checkPermissionApi,
} = require("../../middleware/checkPermissionForApi");
const productApiController = require("../../webservices/productApi.controller");
const { uploadProductImage } = require("../../helper/ImageUpload");
const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.all("/product*", AuthCheck);

namedRouter.post(
  "product.create",
  "/product/create",
  checkPermissionApi("create_record"),
  uploadProductImage.array("image", 10),
  productApiController.createProduct
);
namedRouter.get(
  "product.all",
  "/product/list",
  checkPermissionApi("read_record"),
  productApiController.getAllproducts
);
namedRouter.get(
  "product.single",
  "/product/details/:id",
  checkPermissionApi("update_record"),
  productApiController.singleProduct
);
namedRouter.post(
  "product.update",
  "/product/update/:id",
  checkPermissionApi("update_record"),
  uploadProductImage.array("image", 10),
  productApiController.updateProduct
);
namedRouter.get(
  "product.remove",
  "/product/remove/:id",
  checkPermissionApi("delete_record"),
  productApiController.deleteProduct
);
namedRouter.get(
  "product.category.wise",
  "/product/category-wise-products/:id",
  checkPermissionApi("read_record"),
  productApiController.getCategoryWiseProducts
);

module.exports = Router;
