const Users = require("../models/userModel");
const authenticationAdmin = async (req, res, next) => {
  try {
    //Get user information by id
    const user = await Users.findOne({
      _id: req.user.id,
    });
    if (user.role === 0) {
      return res.status(400).json({ msg: "Admin resources accesss denied" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = authenticationAdmin;
