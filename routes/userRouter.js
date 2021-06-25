const router = require("express").Router();

const userController = require("../controllers/userController");

const authentication = require("../middlewares/authentication");
const authenticationAdmin = require("../middlewares/authenticationAdmin");

router.post("/register", userController.register);

router.get("/refresh_token", userController.refreshToken);

router.post("/login", userController.login);

//google login
router.post("/google_login", userController.googleLogin);

//facebook login
router.post("/facebook_login", userController.facebookLogin);

router.get("/logout", userController.logout);

router.get("/information", authentication, userController.getUser);

//tìm user theo id
router.get("/findUser/:userID", authentication, userController.findUserById);

//tìm admin trả lời cho customer
router.get("/findAnswerAdmin", authentication, userController.getAnswerAdmin);

router.get(
  "/all_information",
  authentication,
  authenticationAdmin,
  userController.getAllUserInfor
);

router.patch("/add_cart", authentication, userController.addcart);

router.patch(
  "/add_favoriteList",
  authentication,
  userController.addToFavoriteList
);

router.get("/history", authentication, userController.history);

router.post("/activation", userController.activateEmail);

router.post("/forget", userController.forgetPassword);

router.post("/reset", authentication, userController.resetPassword);

//send mail confirm đơn hàng
router.post("/confirmMail", authentication, userController.sendConfirmMail);

router.patch("/update", authentication, userController.updateUser);

router.patch(
  "/update_role/:id",
  authentication,
  authenticationAdmin,
  userController.updateUserRole
);

router.delete(
  "/delete/:id",
  authentication,
  authenticationAdmin,
  userController.deleteUser
);

module.exports = router;
