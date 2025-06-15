const roleRepositories = require("../modules/roles/repositories/role.repositories");
const userRepositories = require("../modules/user/repositories/user.repositories");



class Permissions {
  async getPermissionsByRoleName(userId) {
    const userdata=await userRepositories.findById(userId)
    const role = await roleRepositories.findById(userdata.roleId)
    // console.log("rrr", role);
    
    return role ? role.actions : [];
  }
}

const permissions = new Permissions();
module.exports = permissions;
