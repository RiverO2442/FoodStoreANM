const mongoose = require("mongoose");
const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    discountValue: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
      default: 0,
    },
    expireTime: {
      type: String,
      required: true,
    },
    minimumValue: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", discountSchema);
