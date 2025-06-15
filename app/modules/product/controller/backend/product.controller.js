const { getRelativePath } = require("../../../../helper/ImageUpload");
const categoryRepositories = require("../../../category/repositories/category.repositories");
const productRepositories = require("../../repositories/product.repositories");
const fs = require("fs");
const path = require("path");

class ProductController {
  async allProductsPage(req, res) {
    try {
      const allproductdata = await productRepositories.allProducts();
      res.render("product/views/backend/listProduct", {
        title: "Product List",
        data: req.admin,
        products: allproductdata,
      });
    } catch (error) {
      console.log(`Error in getting all products ${error}`);
      req.flash("error", `Error in getting all products ${error}`);
    }
  }

  //add product
  async addProductPage(req, res) {
    try {
      const categories = await categoryRepositories.allCategories();
      res.render("product/views/backend/addProduct", {
        title: "Add Product",
        data: req.admin,
        categories,
      });
    } catch (error) {
      console.log(`Error in getting all products ${error}`);
      req.flash("error", `Error in getting all products ${error}`);
    }
  }

  async createProduct(req, res) {
    try {
      const { title, description, price, stock, categoryId } = req.body;
      if (!title || !description || !price || !stock || !categoryId) {
        req.files.forEach((file) => {
          fs.unlink(
            "./public/backend/uploads/product/" + path.basename(file.path),
            (err) => {
              console.log(`Error in removing the pic ${err}`);
            }
          );
        });
        req.flash("error", "All fields are required");
        return res.redirect("/admin/product/add");
      }

      const productdata = { title, description, price, stock, categoryId };
      productdata.image = req.files.map((file) => getRelativePath(file.path));
      const savedProductData = await productRepositories.newProduct(
        productdata
      );
      if (savedProductData) {
        req.flash("success", "New Product created Successfully");
        return res.redirect("/admin/product/list");
      }
    } catch (error) {
      console.log(`Error in creating product ${error}`);
      //   console.log("reqfile", req.files);

      //   req.files.forEach((file) => {
      //     fs.unlink(
      //       "./public/backend/uploads/product/" + path.basename(file.path),
      //       (err) => {
      //         console.log(`Error in removing the pic ${err}`);
      //       }
      //     );
      //   });
      req.flash("error", "Error in creating product");
      return res.redirect("/admin/product/add");
    }
  }

  async editProductPage(req, res) {
    try {
      const singleproductdata = await productRepositories.findById(
        req.params.id
      );
      const categories = await categoryRepositories.allCategories();
      const slicedData = categories.filter(
        (cat) => cat.catName !== singleproductdata.category.catName
      );
      // console.log("sss",slicedData, singleproductdata.categoryId);

      res.render("product/views/backend/editProduct", {
        title: "Edit Product",
        data: req.admin,
        singledata: singleproductdata,
        slicedData,
      });
    } catch (error) {
      console.log(`Error in edit product page ${error}`);
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      const existingProduct = await productRepositories.findById(id);
      if (!existingProduct) {
        req.flash("error", "Product not found");
        return res.redirect(`/admin/product/edit/${id}`);
      }

      if (req.files.length > 0) {
        Array.isArray(existingProduct.image) &&
          existingProduct.image.forEach((file) => {
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
        req.flash("success", "Product Data Updated Successfully");
        return res.redirect("/admin/product/list");
      }
    } catch (error) {
      console.log(`Error in updating product ${error}`);
      req.files.map((file) => {
        fs.unlink(
          "./public/backend/uploads/product/" + path.basename(file.path),
          (err) => {
            console.log(`Error in removing the pic ${err}`);
          }
        );
      });
      req.flash("error", "Error detected in updating product");
      return res.redirect(`/admin/product/edit/${req.params.id}`);
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      const existingProduct = await productRepositories.findById(id);
      if (!existingProduct) {
        req.flash("error", "Product Not Found");
        return res.redirect(`/admin/product/list`);
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
        req.flash("success", "Product Data Removed Successfully");
        return res.redirect("/admin/product/list");
      }
    } catch (error) {
      console.log(`Error in removing product ${error}`);
    }
  }
}

module.exports = new ProductController();
