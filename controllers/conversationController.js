const Conversation = require("../models/conversationModel");

const Users = require("../models/userModel");

const conversationController = {
  createConversation: async (req, res) => {
    try {
      const check = await Conversation.findOne({
        members: { $all: [req.body.senderID, req.body.receiverID] },
      });

      if (check)
        return res
          .status(400)
          .json({ msg: "The conversation already exist !" });

      const newConversation = new Conversation({
        members: [req.body.senderID, req.body.receiverID],
      });
      await newConversation.save();
      res.status(200).json(newConversation);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  findConversationByUser: async (req, res) => {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userID] },
      });
      res.status(200).json(conversation);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  findConversationByTwoUsers: async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstID, req.params.secondID] },
      });
      res.status(200).json(conversation);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllConversation: async (req, res) => {
    try {
      const conversations = await Conversation.find();
      res.status(200).json(conversations);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserConversation: async (req, res) => {
    try {
      let friendList = [];
      const conversations = await Conversation.find();

      const allJoinersArray1 = await Promise.all(
        conversations.map((conversation) => {
          return conversation.members[0];
        })
      );

      const allJoinersArray2 = await Promise.all(
        conversations.map((conversation) => {
          return conversation.members[1];
        })
      );

      const friendsList1 = await Promise.all(
        allJoinersArray1.map((joiner) => {
          return Users.findById(joiner);
        })
      );

      const friendsList2 = await Promise.all(
        allJoinersArray2.map((joiner) => {
          return Users.findById(joiner);
        })
      );

      friendsList1.map((friend) => {
        if (friend.role !== 1) {
          const { _id, name, avatar } = friend;
          friendList.push({ _id, name, avatar });
        }
      });

      friendsList2.map((friend) => {
        if (friend.role !== 1) {
          const { _id, name, avatar } = friend;
          friendList.push({ _id, name, avatar });
        }
      });

      res.status(200).json(friendList);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = conversationController;
