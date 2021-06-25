const router = require("express").Router();
const conversationController = require("../controllers/conversationController");
const authenticationAdmin = require("../middlewares/authenticationAdmin");
const authentication = require("../middlewares/authentication");

router.post(
  "/newConversation",
  authentication,
  conversationController.createConversation
);

router.get(
  "/findConversation/:userID",
  authentication,
  conversationController.findConversationByUser
);

//get conversation by two users
router.get(
  "/findConversation/:firstID/:secondID",
  authentication,
  conversationController.findConversationByTwoUsers
);

router.get(
  "/allConversation",
  authentication,
  authenticationAdmin,
  conversationController.getAllConversation
);

router.get(
  "/getUserConversation",
  authentication,
  authenticationAdmin,
  conversationController.getUserConversation
);

module.exports = router;
