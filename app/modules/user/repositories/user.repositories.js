const { UserModel } = require("../model/user.model");

class UserRepositories {
  async save(data) {
    try {
      const result = await UserModel.create(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async alluser() {
    try {
      const result = await UserModel.aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role_details",
          },
        },
        {
          $unwind: "$role_details",
        },
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(data) {
    try {
      const result = await UserModel.findOne(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findById(id) {
    try {
      const result = await UserModel.findById(id);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findByIdAndUpdate(id, data) {
    try {
      const result = await UserModel.findByIdAndUpdate(id, data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserRepositories();
