const Comments = require("../models/commentModel");
const Products = require("../models/productModel");

const commentController = {
  createComment: async (req, res) => {
    try {
      const { content, writer, about, responseTo, star, length, totalStar } =
        req.body;

      const newComment = new Comments({
        content,
        writer,
        about,
        responseTo,
        star,
      });

      const calcStar = (totalStar + star) / (length + 1);

      // cập nhật số sao cho sản phẩm đang comment sau khi người dùng comment đánh giá.
      productStarUpdate(about, calcStar);

      await newComment.save();

      res.json(newComment);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllComments: async (req, res) => {
    try {
      const comments = await Comments.find({ about: req.params.id });
      res.json({
        length: comments.length,
        comments: comments,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const productStarUpdate = async (about, calcStar) => {
  await Products.findOneAndUpdate(
    { _id: about },
    {
      star: calcStar,
    }
  );
};

module.exports = commentController;
