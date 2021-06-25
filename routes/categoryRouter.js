const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const authenticationAdmin = require("../middlewares/authenticationAdmin");
const authentication = require("../middlewares/authentication");

router.get("/category", categoryController.getCategories);
router.post(
  "/category",
  authentication,
  authenticationAdmin,
  categoryController.createCategory
);

router.delete(
  "/category/:id",
  authentication,
  authenticationAdmin,
  categoryController.deleteCategory
);

router.put(
  "/category/:id",
  authentication,
  authenticationAdmin,
  categoryController.updateCategory
);

module.exports = router;
