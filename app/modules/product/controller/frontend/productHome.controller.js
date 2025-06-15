const { getRelativePath } = require("../../../../helper/ImageUpload");
const categoryRepositories = require("../../../category/repositories/category.repositories");
const productRepositories = require("../../repositories/product.repositories");
const fs = require("fs");
const path = require("path");

class ProductController {
  async allProductsPage(req, res) {
    try {
      const allproductdata = await productRepositories.allProducts();
      const allcategories = await categoryRepositories.allCategories();
      res.render("product/views/frontend/products", {
        title: "Product List",
        data: req.user,
        products: allproductdata,
        allcategories,
      });
    } catch (error) {
      console.log(`Error in getting all products ${error}`);
      req.flash("error", `Error in getting all products ${error}`);
    }
  }

  async getProductDetailsPage(req,res) {
    try {
      const singleProduct=await productRepositories.findById(req.params.id)
      res.render("product/views/frontend/productDetails", {
        title: "Product Details",
        data: req.user,
        detail: singleProduct,
        // allcategories,
      });
    } catch (error) {
      console.log("Error in getting product details page", error);
      
    }
  }

  async getCategoryWiseProducts(req, res) {
    try {
      const catwiseproductdata = await productRepositories.cateWiseProducts(
        req.params.id
      );
      const allcategories = await categoryRepositories.allCategories();
      res.render("product/views/frontend/catWiseProducts", {
        title: "Product List",
        data: req.user,
        products: catwiseproductdata,
        allcategories,
      });
    } catch (error) {
      console.log(`Error in getting all products ${error}`);
      req.flash("error", `Error in getting all products ${error}`);
    }
  }

  async searchProducts(req, res) {
    try {
      const allcategories = await categoryRepositories.allCategories();
      const { title, category, priceRange } = req.query;
      const filter = {};

      if (title) filter.title = { $regex: title, $options: "i" };
      if (category) filter.category = category;
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split("-");
        filter.price = { $gte: minPrice, $lte: maxPrice };
      }

      const products = await productRepositories.find(filter);
      res.render("product/views/frontend/searchProduct", {
        title: "Product List",
        data: req.user,
        products,
        allcategories,
      });
    } catch (err) {
      res.status(400).json({ message: "Error searching products", error: err });
    }
  }
}

module.exports = new ProductController();
