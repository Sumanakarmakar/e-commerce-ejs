const express = require("express");
const routeLabel = require("route-label");
const AdminAuthCheck = require("../../middleware/adminAuth");
const roleController = require("../../modules/roles/controller/role.controller");
const Router = express.Router();

const namedRouter = routeLabel(Router);

namedRouter.all("/roles*", AdminAuthCheck)

namedRouter.get("role.add", "/roles/addrole", roleController.addRolePage);
namedRouter.post("role.create", "/roles/create", roleController.createRole);
namedRouter.get("roles.all", "/roles", roleController.allRoles);
namedRouter.get("roles.details", "/roles/details/:id", roleController.singleRoles);
namedRouter.post("roles.actions.update", "/roles/actions/update/:id", roleController.updateActions);


module.exports = Router;
