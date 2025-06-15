const fs = require("fs");
const path = require("path");
const { getRelativePath } = require("../helper/ImageUpload");
const productRepositories = require("../modules/product/repositories/product.repositories");

class ProductApiController {
  async createProduct(req, res) {
    try {
      const { title, description, price, stock, categoryId } = req.body;
      if (!title || !description || !price || !stock || !categoryId) {
        req.files.map((file) => {
          fs.unlink(
            "./public/backend/uploads/product/" + path.basename(file.path),
            (err) => {
              console.log(`Error in removing the pic ${err}`);
            }
          );
        });
        return res.status(400).json({
          status: 400,
          message: "All Fields are Required",
        });
      }

      const productdata = { title, description, price, stock, categoryId };
      productdata.image = req.files.map((file) => getRelativePath(file.path));
      const savedProductData = await productRepositories.newProduct(
        productdata
      );
      if (savedProductData) {
        return res.status(201).json({
          status: 200,
          message: "New Product created Successfully",
          data: savedProductData,
        });
      }
    } catch (error) {
      console.log(`Error in creating product ${error}`);
      req.files.map((file) => {
        fs.unlink(
          "./public/backend/uploads/product/" + path.basename(file.path),
          (err) => {
            console.log(`Error in removing the pic ${err}`);
          }
        );
      });
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async getAllproducts(req, res) {
    try {
      const allProductData = await productRepositories.allProducts();
      if (allProductData) {
        return res.status(200).json({
          status: 200,
          total: allProductData.length,
          message: "All Products Fetched Successfully",
          data: allProductData,
        });
      }
    } catch (error) {
      console.log(`Error in getting all products ${error}`);
      return res.status(500).json({
        statu: 500,
        message: "Internal Server Error",
      });
    }
  }

  async singleProduct(req, res) {
    try {
      const singledata = await productRepositories.findById(req.params.id);
      if (singledata) {
        return res.status(200).json({
          status: 200,
          message: "Product Details Fetched Successfully",
          data: singledata,
        });
      }
    } catch (error) {
      console.log(`Error in getting single product ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      const existingProduct = await productRepositories.findById(id);
      if (!existingProduct) {
        return res.status(400).json({
          status: 400,
          message: "Product not found",
        });
      }

      if (req.files.length > 0) {
        existingProduct.image.map((file) => {
          fs.unlink(
            "./public/backend/uploads/product/" + path.basename(file),
            (err) => {
              console.log(`Error in removing the pic ${err}`);
            }
          );
        });

        req.body.image = req.files.map((file) => getRelativePath(file.path));
      } else {
        req.body.image = existingProduct.image;
      }
      const updatedData = await productRepositories.findByIdAndUpdate(
        id,
        req.body
      );
      if (updatedData) {
        return res.status(200).json({
          status: 200,
          message: "Product Data Updated Successfully",
        });
      }
    } catch (error) {
      console.log(`Error in updating product ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      const existingProduct = await productRepositories.findById(id);
      if (!existingProduct) {
        return res.status(400).json({
          status: 400,
          message: "Product not found",
        });
      }
      existingProduct.image.map((file) => {
        fs.unlink(
          "./public/backend/uploads/product/" + path.basename(file),
          (err) => {
            console.log(`Error in removing the pic ${err}`);
          }
        );
      });
      const removedData = await productRepositories.findByIdAndDelete(id);
      if (removedData) {
        return res.status(200).json({
          status: 200,
          message: "Product Data Removed Successfully",
        });
      }
    } catch (error) {
      console.log(`Error in updating product ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  // Search and Filter products
  async searchProducts(req, res) {
    try {
      const { title, category, priceRange } = req.query;
      const filter = {};

      if (title) filter.title = { $regex: title, $options: "i" };
      if (category) filter.category = category;
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split("-");
        filter.price = { $gte: minPrice, $lte: maxPrice };
      }

      const products = await productRepositories.find(filter);
      res.status(200).json(products);
    } catch (err) {
      res.status(400).json({ message: "Error searching products", error: err });
    }
  }

  async getFilteredProducts(req, res) {
    try {
      const { category, minPrice, maxPrice, stock } = req.query;
      const filter = {};

      if (category) filter.category = category;
      if (minPrice && maxPrice) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
      }
      if (stock) filter.stock = { $gte: 1 };

      const products = await productRepositories.filterProducts(filter);

      res.status(200).json({
        status: 200,
        message: "Filtered Products Fetched Successfully",
        data: products,
      });
    } catch (err) {
      res.status(400).json({ message: "Error fetching products", error: err });
    }
  }

  async getCategoryAnalytics(req, res) {
    try {
      const { categoryId } = req.params;
      const analytics = await productRepositories.catAnalytics(categoryId);
      res.status(200).json({
        status: 200,
        message: "Product stock fetched Successfully",
        data: analytics,
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Error fetching category analytics", error: err });
    }
  }

  //get category wise products
  async getCategoryWiseProducts(req, res) {
    try {
      const catwisedata = await productRepositories.cateWiseProducts(
        req.params.id
      );
      if (catwisedata) {
        return res.status(200).json({
          status: 200,
          total: catwisedata.products.length,
          message: "Category wise products fetched successfully",
          data: catwisedata,
        });
      }
    } catch (error) {
      console.log(`Error in getting category wise products ${error}`);
      return res.status(200).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }
}

module.exports = new ProductApiController();
