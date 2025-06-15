const express = require("express");
const routeLabel = require("route-label");
const AuthCheck = require("../../middleware/authForApi");
const categoryApiController = require("../../webservices/categoryApi.controller");
const {
  checkPermissionApi,
} = require("../../middleware/checkPermissionForApi");
const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.all("/category*", AuthCheck);

namedRouter.post(
  "category.create",
  "/category/create",
  checkPermissionApi("create_record"),
  categoryApiController.createCategory
);
namedRouter.get(
  "category.all",
  "/category/list",
  checkPermissionApi("read_record"),
  categoryApiController.getAllCategories
);
namedRouter.get(
  "category.single",
  "/category/details/:id",
  checkPermissionApi("update_record"),
  categoryApiController.getSinglecategory
);
namedRouter.post(
  "category.update",
  "/category/update/:id",
  checkPermissionApi("update_record"),
  categoryApiController.updateCategory
);
namedRouter.get(
  "category.delete",
  "/category/remove/:id",
  checkPermissionApi("delete_record"),
  categoryApiController.deleteCategory
);

module.exports = Router;
