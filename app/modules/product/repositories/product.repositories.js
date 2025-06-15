const { default: mongoose } = require("mongoose");
const CategoryModel = require("../../category/model/category.model");
const ProductModel = require("../model/product.model");

class ProductRepositories {
  async newProduct(data) {
    try {
      const result = await ProductModel.create(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async allProducts() {
    try {
      const result = await ProductModel.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category_details",
          },
        },
        {
          $unwind: "$category_details",
        },
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async find(data) {
    try {
      const result = await ProductModel.find(data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findById(id) {
    try {
      const result = await ProductModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: "$category"
        }
      ])
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }

  async findByIdAndUpdate(id, data) {
    try {
      const result = await ProductModel.findByIdAndUpdate(id, data);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findByIdAndDelete(id) {
    try {
      const result = await ProductModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async filterProducts(data) {
    try {
      const result = await ProductModel.aggregate([
        {
          $match: data,
        },
        { $sort: { price: 1 } }, // Sort by price, ascending
        { $project: { title: 1, price: 1, description: 1, image: 1 } },
      ]);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async catAnalytics(id) {
    try {
      const result = await ProductModel.aggregate([
        { $match: { categoryId: id } },
        {
          $group: {
            _id: "$categoryId",
            averagePrice: { $avg: "$price" },
            totalStock: { $sum: "$stock" },
          },
        },
        { $project: { _id: 1, averagePrice: 1, totalStock: 1 } },
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async cateWiseProducts(id) {
    try {
      const result = await CategoryModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "categoryId",
            as: "products",
          },
        },
        {
          $project: {
            _id: 1,
            catName: 1,
            products: {
              $map: {
                input: "$products",
                as: "product",
                in: {
                  title: "$$product.title",
                  description: "$$product.description",
                  price: "$$product.price",
                  stock: "$$product.stock",
                  image: "$$product.image",
                },
              },
            },
          },
        },
      ]);
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ProductRepositories();
