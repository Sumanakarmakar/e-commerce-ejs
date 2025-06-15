const roleRepositories = require("../repositories/role.repositories");

class RoleController {
  //for all roles
  async allRoles(req, res) {
    try {
      const allRoleData = await roleRepositories.findRoles();
      var msz = req.flash("message");
      res.render("roles/views/listRole", {
        title: "All Roles",
        data: req.admin,
        roles: allRoleData,
        msz,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //add role page
  async addRolePage(req, res) {
    try {
      const msz = req.flash("message");
      res.render("roles/views/addRole", {
        title: "Add Role",
        data: req.admin,
        msz,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //for creating new role
  async createRole(req, res) {
    try {
      const { roleName, actions } = req.body;
      const data = { roleName, actions };
      const roledata = await roleRepositories.roleSave(data);
      if (roledata) {
        req.flash("message", "New role Created successfully");
        res.redirect("/admin/roles");
      } else {
        req.flash("message", "Role is not added properly");
        res.redirect("/admin/roles/addrole");
      }
    } catch (error) {
      console.log(error);
    }
  }

  //for getting single role
  async singleRoles(req, res) {
    try {
      var msz = req.flash("message");
      const id = req.params.id;
      const singleRoleData = await roleRepositories.findById(id);
      
      res.render("roles/views/editRole", {
        title: "Edit Role",
        data: req.admin,
        singledata: singleRoleData,
        msz,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //for edit role actions
  async updateActions(req, res) {
    try {
      const id = req.params.id;
      const updatedData = await roleRepositories.findByIdAndUpdate(id, req.body);
      if (updatedData) {
        req.flash("message", "Role Data Updated Successfully");
        res.redirect("/admin/roles");
      } else {
        req.flash("message", "Role Data is not Updated");
        res.redirect(`/admin/roles/details/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new RoleController();
