const { json } = require("body-parser");
const Products = require("../models/productModel");

//filter , sorting and paginating

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((exField) => delete queryObj[exField]); // loại bỏ những tham số query k cần nằm trong danh sách exclude fields.
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g, // tham số giúp lọc bộ tìm kiếm ( gte : lớn hơn hoặc bằng , tương tự vvv)
      (match) => "$" + match // regex giúp tìm kí tự có trong giá trị query params (chỉ cần có là dc)
      // ví dụ regex = man thì cả man và woman đều tìm dc
    );
    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      // queryString.sort ( sort là một query param nằm trong danh sách thuộc tính của đối tượng queryString)
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1; // số thứ tự của page muốn truy cập chứ k phải tổng số pages muốn chia
    const limit = this.queryString.limit * 1 || 9; // limit là giới hạn số documentations muốn lấy tính từ đầu
    const skip = (page - 1) * limit; // skip là bỏ qua số documentations tính từ đầu
    this.query = this.query.skip(skip).limit(limit); // page -1 là vì số thứ tự đc đếm như mảng tính từ 0

    return this;
  }
}

const productController = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const products = await features.query;
      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        image,
        category,
      } = req.body;
      if (!image) return res.status(400).json({ msg: "No image upload" });
      const product = await Products.findOne({ product_id });
      if (product) {
        return res
          .status(400)
          .json({ msg: "This product already exist in the database" });
      }
      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        image,
        category,
      });
      await newProduct.save();
      res.json({ msg: "Created a new product ! " });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: " Deleted product successfully !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, image, category } = req.body;
      if (!image) return res.status(400).json({ msg: "No image upload" });
      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          image,
          category,
        }
      );
      res.json({ msg: "Updated Product !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = productController;
