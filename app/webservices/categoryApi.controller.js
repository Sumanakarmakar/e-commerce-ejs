const categoryRepositories = require("../modules/category/repositories/category.repositories");

class CategoryApiController {
  async createCategory(req, res) {
    try {
      const { catName } = req.body;
      if (!catName) {
        return res.status(400).json({
          status: 400,
          message: "Category Name is Required",
        });
      }
      const catdata = { catName };
      const savedCatData = await categoryRepositories.newCategory(catdata);
      if (savedCatData) {
        return res.status(201).json({
          status: 200,
          message: "New category created successfully",
          data: savedCatData,
        });
      }
    } catch (error) {
      console.log(`Error in creating product category ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async getAllCategories(req, res) {
    try {
      const allcatdata = await categoryRepositories.allCategories();
      if (allcatdata.length > 0) {
        return res.status(200).json({
          status: 200,
          message: "All categories fetched successfully",
          data: allcatdata,
        });
      } else {
        return res.status(400).json({
          status: 400,
          message: "No categories found",
        });
      }
    } catch (error) {
      console.log(`Error in getting all product categories ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async getSinglecategory(req, res) {
    try {
      const catdata = await categoryRepositories.findById(req.params.id);
      if (catdata) {
        return res.status(200).json({
          status: 200,
          message: "Single Category Fetched successfully",
          data: catdata,
        });
      }
    } catch (error) {
      console.log(`Error in getting single category ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const id = req.params.id;
      const updatedcatdata = await categoryRepositories.findByIdAndUpdate(
        id,
        req.body
      );
      if (updatedcatdata) {
        return res.status(200).json({
          status: 200,
          message: "Category Data Updated Successfully",
        });
      }
    } catch (error) {
      console.log(`Error in updating category ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const id = req.params.id;
      const deletedcatdata = await categoryRepositories.findByIdAndUpdate(id, {
        isDeleted: true,
      });
      if (deletedcatdata) {
        return res.status(200).json({
          status: 200,
          message: "Category Data Removed Successfully",
        });
      }
    } catch (error) {
      console.log(`Error in removing category ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }
}

module.exports = new CategoryApiController();
