const router = require("express").Router();

const productController = require("../controllers/productController");

const authentication = require("../middlewares/authentication");
const authenticationAdmin = require("../middlewares/authenticationAdmin");

router
  .route("/products")
  .get(productController.getProducts)
  .post(authentication, authenticationAdmin, productController.createProduct);

router
  .route("/products/:id")
  .delete(authentication, authenticationAdmin, productController.deleteProduct)
  .put(authentication, authenticationAdmin, productController.updateProduct);

module.exports = router;
