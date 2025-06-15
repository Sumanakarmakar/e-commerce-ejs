const RoleModel = require("../model/role.model");

class RoleRepositories {
  async roleSave(data) {
    try {
      const result = await RoleModel.create(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findRoles() {
    try {
      const result = await RoleModel.find();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findById(id) {
    try {
      const result = await RoleModel.findById(id);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(data) {
    try {
      const result = await RoleModel.findOne(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findByIdAndUpdate(id, data) {
    try {
      const result = await RoleModel.findByIdAndUpdate(id, data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new RoleRepositories();
