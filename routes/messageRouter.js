const router = require("express").Router();
const messageController = require("../controllers/messageController");

const authentication = require("../middlewares/authentication");

//add new Message
router.post("/newMessage", authentication, messageController.createMessage);

router.get(
  "/findMessages/:conversationID",
  authentication,
  messageController.getMessagesByConversationID
);

module.exports = router;
