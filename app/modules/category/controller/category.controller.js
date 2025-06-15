const productRepositories = require("../../product/repositories/product.repositories");
const categoryRepositories = require("../repositories/category.repositories");

class CategoryController {
    //list of categories
  async getAllCategories(req, res) {
    try {
      const allcatdata = await categoryRepositories.allCategories();
      res.render("category/views/listCategory", {
        title: "Category List",
        data: req.admin,
        categories: allcatdata,
      });
    } catch (error) {
      console.log(`Error in getting all product categories ${error}`);
    }
  }

  //add category page
  async addCategoryPage(req, res) {
    try {
      res.render("category/views/addCategory", {
        title: "Create Category",
        data: req.admin,
      });
    } catch (error) {
      console.log(`Error in getting add category page ${error}`);
    }
  }

  async createCategory(req, res) {
    try {
      const { catName } = req.body;
      if (!catName) {
        req.flash("error", "Category Name is Required")
        return res.redirect("/admin/category/add")
      }
      const catdata = { catName };
      const savedCatData = await categoryRepositories.newCategory(catdata);
      if (savedCatData) {
        req.flash("success", "New category created successfully")
        return res.redirect("/admin/category/list")
      }
    } catch (error) {
      console.log(`Error in creating product category ${error}`);
      req.flash("error", "Error detected")
      return res.redirect("/admin/category/add")
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

  //get category wise products
    async getCategoryWiseProducts(req,res){
      try {
        const catwisedata=await productRepositories.cateWiseProducts(req.params.id)
        res.render("category/views/catWiseProducts", {
          title: `${catwisedata.catName} Products`,
          data: req.admin,
          products: catwisedata
        })
      } catch (error) {
        console.log(`Error in getting category wise products ${error}`);
      }
    }
}

module.exports = new CategoryController();
