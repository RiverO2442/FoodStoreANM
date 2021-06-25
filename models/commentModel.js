const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    about: {
      type: String,
      trim: true,
      required: true,
    },
    writer: {
      type: Object,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    responseTo: {
      type: String,
      trim: true,
    },
    star: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentSchema);
