const express = require("express");
const routeLabel = require("route-label");
const userController = require("../../modules/user/controller/backend/user.controller");
const AdminAuthCheck = require("../../middleware/adminAuth");
const categoryController = require("../../modules/category/controller/category.controller");
const { checkPermission } = require("../../middleware/checkAdminPermission");
const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.all("/category*", AdminAuthCheck, userController.authcheckUser);

namedRouter.get(
  "category.all",
  "/category/list",
  checkPermission("read_record"),
  categoryController.getAllCategories
);
namedRouter.get(
  "category.addpage",
  "/category/add",
  checkPermission("create_record"),
  categoryController.addCategoryPage
);
namedRouter.post(
  "category.create",
  "/category/create",
  checkPermission("create_record"),
  categoryController.createCategory
);
namedRouter.get(
  "category.wise.product",
  "/category/category-wise-products/:id",
  checkPermission("read_record"),
  categoryController.getCategoryWiseProducts
);

module.exports = Router;
