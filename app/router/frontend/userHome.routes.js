const express = require("express");
const routeLabel = require("route-label");
const userHomeController = require("../../modules/user/controller/frontend/userHome.controller");
const { uploadUserImage } = require("../../helper/ImageUpload");
const UserAuthCheck = require("../../middleware/userAuth");

const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.get("home.page", "/", UserAuthCheck, userHomeController.home);
namedRouter.get("login.page", "/login", userHomeController.loginPage);
namedRouter.get(
  "registration.page",
  "/register",
  userHomeController.registrationPage
);
namedRouter.post(
  "registration",
  "/user/create",
  uploadUserImage.single("profile_pic"),
  userHomeController.createUser
);
namedRouter.get(
  "confirmation",
  "/confirmation/:email/:token",
  userHomeController.confirmation
);
namedRouter.post("user.login", "/user/login", userHomeController.loginUser);

namedRouter.all("/user*", UserAuthCheck, userHomeController.authcheckUser);

namedRouter.get(
  "user.dashboard",
  "/user/dashboard",
  userHomeController.dashboard
);
namedRouter.get("user.logout", "/logout", userHomeController.logout);

module.exports = Router;
