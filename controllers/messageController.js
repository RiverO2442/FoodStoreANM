const Message = require("../models/messageModel");

const messageController = {
  createMessage: async (req, res) => {
    try {
      const newMessage = new Message(req.body);
      await newMessage.save();
      res.status(200).json(newMessage);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getMessagesByConversationID: async (req, res) => {
    try {
      const messages = await Message.find({
        conversationID: req.params.conversationID,
      });
      res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = messageController;
