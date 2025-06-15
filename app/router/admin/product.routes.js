const express = require("express");
const routeLabel = require("route-label");
const userController = require("../../modules/user/controller/backend/user.controller");
const AdminAuthCheck = require("../../middleware/adminAuth");
const { checkPermission } = require("../../middleware/checkAdminPermission");
const productController = require("../../modules/product/controller/backend/product.controller");
const { uploadProductImage } = require("../../helper/ImageUpload");
const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.all("/product*", AdminAuthCheck, userController.authcheckUser);

namedRouter.get(
  "product.all",
  "/product/list",
  checkPermission("read_record"),
  productController.allProductsPage
);
namedRouter.get(
  "product.addpage",
  "/product/add",
  checkPermission("create_record"),
  productController.addProductPage
);
namedRouter.post(
  "product.create",
  "/product/create",
  checkPermission("create_record"),
  uploadProductImage.array("image", 10),
  productController.createProduct
);
namedRouter.get(
  "product.edit",
  "/product/edit/:id",
  checkPermission("update_record"),
  productController.editProductPage
);
namedRouter.post(
  "product.update",
  "/product/update/:id",
  checkPermission("update_record"),
  uploadProductImage.array("image", 10),
  productController.updateProduct
);
namedRouter.get(
  "product.remove",
  "/product/remove/:id",
  checkPermission("delete_record"),
  productController.deleteProduct
);

module.exports = Router;
