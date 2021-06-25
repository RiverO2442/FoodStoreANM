const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const authentication = require("../middlewares/authentication");
const authenticationAdmin = require("../middlewares/authenticationAdmin");

router
  .route("/payment")
  .get(authentication, authenticationAdmin, paymentController.getPayments)
  .post(authentication, paymentController.createPayment);

module.exports = router;
