const Discount = require("../models/discountModel");

const discountController = {
  getDiscounts: async (req, res) => {
    try {
      const discounts = await Discount.find();
      res.json(discounts);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createDiscount: async (req, res) => {
    try {
      // if user has role = 1 => admin
      //only admin can create , delete and update categories

      const { name, discountValue, expireTime, minimumValue } = req.body;
      const discount = await Discount.findOne({ name });
      if (discount)
        return res.status(400).json({ msg: "This coupon name already exist" });

      const checkDiscount = await Discount.findOne({ discountValue });
      if (checkDiscount)
        return res.status(400).json({ msg: "Discount value must be unique!" });

      const checkMinimumValue = await Discount.findOne({ minimumValue });
      if (checkMinimumValue)
        return res.status(400).json({ msg: "Minimum value must be unique!" });

      const newDiscount = new Discount({
        name,
        discountValue,
        expireTime,
        minimumValue,
      });
      await newDiscount.save();
      res.json(
        "Check admin success and create a new discount coupon successfully !"
      );
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteDiscount: async (req, res) => {
    try {
      await Discount.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a discount !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateDiscount: async (req, res) => {
    try {
      const { name, discountValue, expireTime, minimumValue, id } = req.body;

      const checkName = await Discount.findOne({ name });
      if (checkName) {
        if (checkName._id != id) {
          return res
            .status(400)
            .json({ msg: "This coupon name already exist" });
        }
      }

      const checkDiscount = await Discount.findOne({ discountValue });
      if (checkDiscount) {
        if (checkDiscount._id != id) {
          return res
            .status(400)
            .json({ msg: "Discount value must be unique!" });
        }
      }

      const checkMinimumValue = await Discount.findOne({ minimumValue });
      if (checkMinimumValue) {
        if (checkMinimumValue._id != id) {
          return res.status(400).json({ msg: "Minimum value must be unique!" });
        }
      }

      await Discount.findByIdAndUpdate(
        { _id: req.params.id },
        { name, discountValue, expireTime, minimumValue }
      );
      res.json({ msg: "Updated a discount !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = discountController;
