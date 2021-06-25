const router = require("express").Router();
const discountController = require("../controllers/discountController");
const authenticationAdmin = require("../middlewares/authenticationAdmin");
const authentication = require("../middlewares/authentication");

router.get("/discount", discountController.getDiscounts);
router.post(
  "/discount",
  authentication,
  authenticationAdmin,
  discountController.createDiscount
);

router.delete(
  "/discount/:id",
  authentication,
  authenticationAdmin,
  discountController.deleteDiscount
);

router.put(
  "/discount/:id",
  authentication,
  authenticationAdmin,
  discountController.updateDiscount
);

module.exports = router;
