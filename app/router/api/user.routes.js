const express = require("express");
const routeLabel = require("route-label");
const userApiController = require("../../webservices/userApi.controller");
const { uploadUserImage } = require("../../helper/ImageUpload");
const Router = express.Router();
const AuthCheck = require("../../middleware/authForApi");

const namedRouter = routeLabel(Router);

namedRouter.post(
  "user.create",
  "/user/create",
  uploadUserImage.single("profile_pic"),
  userApiController.createUser
);
namedRouter.get(
  "user.confirmation.mail",
  "/confirmation/:email/:token",
  userApiController.confirmation
);
namedRouter.post("user.login", "/user/login", userApiController.loginUser);

namedRouter.all("/user*", AuthCheck);

namedRouter.get(
  "user.profile.details",
  "/user/profile",
  userApiController.profile
);
namedRouter.post(
  "user.profile_pic.update",
  "/user/profile-image/update",
  uploadUserImage.single("profile_pic"),
  userApiController.updateProfilePic
);
namedRouter.post(
  "user.profile.update",
  "/user/profile-details/update",
  userApiController.updateProfileData
);
namedRouter.post(
  "user.password.update",
  "/user/password/update",
  userApiController.updatePassword
);

namedRouter.post(
  "user.password.forget",
  "/forgot-password",
  userApiController.forgetPassword
);
namedRouter.get(
  "user.password.reset.confirmation",
  "/reset_password/:email/:token",
  userApiController.resetPWConfirmation
);
namedRouter.post(
  "user.password.reset",
  "/reset_password/:email/:token",
  userApiController.resetPassword
);

module.exports = Router;
