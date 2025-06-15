const roleRepositories = require("../modules/roles/repositories/role.repositories");

class RoleApiController {
  async createRole(req, res) {
    try {
      const { roleName, actions } = req.body;
      if (!roleName || !actions) {
        return res.status(400).json({
          status: 400,
          message: "All Fields are required",
        });
      }

      const roledata = { roleName, actions };
      const savedRoleData = await roleRepositories.roleSave(roledata);
      if (savedRoleData) {
        return res.status(201).json({
          status: 200,
          message: "New Role created Successfully",
          data: savedRoleData,
        });
      }
    } catch (error) {
      console.log(`Error in creating role ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal server Error",
      });
    }
  }

  async allRoles(req, res) {
    try {
      const allRoleData = await roleRepositories.findRoles();
      if (allRoleData) {
        return res.status(200).json({
          status: 200,
          message: "All Roles fetched Successfully",
          data: allRoleData,
        });
      }
    } catch (error) {
      console.log(`Error in creating role ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal server Error",
      });
    }
  }
}

module.exports = new RoleApiController();
