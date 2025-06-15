const CategoryModel = require("../model/category.model");

class CategoryRepositories {
  async newCategory(data) {
    try {
      const result = await CategoryModel.create(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async allCategories() {
    try {
      const result = await CategoryModel.find();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findById(id) {
    try {
      const result = await CategoryModel.findById(id);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findByIdAndUpdate(id, data) {
    try {
      const result = await CategoryModel.findByIdAndUpdate(id, data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CategoryRepositories();
