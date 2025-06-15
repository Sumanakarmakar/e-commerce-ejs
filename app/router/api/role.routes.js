const express = require("express");
const routeLabel = require("route-label");
const roleApiController = require("../../webservices/roleApi.controller");
const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.post("role.create", "/role/create", roleApiController.createRole);
namedRouter.get("roles.all", "/roles", roleApiController.allRoles);

module.exports = Router;
