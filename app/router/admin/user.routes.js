const express = require("express");
const routeLabel = require("route-label");
const userController = require("../../modules/user/controller/backend/user.controller");
const AdminAuthCheck = require("../../middleware/adminAuth");
const { uploadUserImage } = require("../../helper/ImageUpload");
const Router = express.Router();


const namedRouter = routeLabel(Router);

namedRouter.get("admin.login.page", "/", userController.loginPage);
namedRouter.post("admin.login", "/login-create", userController.loginAdmin);

namedRouter.all("/*", AdminAuthCheck, userController.authcheckUser);

namedRouter.get("admin.dashboard", "/dashboard", userController.dashboard);
namedRouter.get("admin.users.all", "/users", userController.alluserspage);

namedRouter.get("admin.profile.details", "/profile", userController.profile);
namedRouter.get(
  "admin.profile.pic",
  "/profile_pic/edit/:id",
  userController.editProfilePicPage
);
namedRouter.post(
  "user.profile_pic.update",
  "/profile_pic/update/:id",
  uploadUserImage.single("profile_pic"),
  userController.updateProfilePic
);
namedRouter.get(
  "admin.profile.edit",
  "/profile/edit/:id",
  userController.editProfilePage
);
namedRouter.post(
  "user.profile.update",
  "/profile/update/:id",
  userController.updateProfile
);
namedRouter.get(
  "admin.password.edit",
  "/password/edit/:id",
  userController.editPasswordPage
);
namedRouter.post(
  "user.password.update",
  "/password/update/:id",
  userController.updatePassword
);
namedRouter.get("admin.logout", "/logout", userController.logout);

module.exports = Router;
