const User = require("../models/User");
const Post = require("../models/Post");
const fs = require("fs");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.createChat = async (req, res) => {
  try {
    const member1Id = req.params.member1;
    const member2Id = req.params.member2;

    let newChat = new Chat();
    newChat.member1 = member1Id;
    newChat.member2 = member2Id;

    await newChat.save();

    const member1 = await User.findById(member1Id);
    const member2 = await User.findById(member2Id);

    const allChats = await Chat.find({});
    const promise = allChats.map(async (cId) => {
      const chatObject = await Chat.findById(cId);
      return chatObject;
    });

    const chats = await Promise.all(promise);

    chats.forEach((c) => {
      if (c.member1 === member1Id && c.member2 === member2Id) {
        member1.chats.push(c);
        member2.chats.push(c);
      }
    });

    await member1.save();
    await member2.save();

    res.json({
      successMessage: `Chat created successfully!`,
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getDoesChatExistResult = async (req, res) => {
  try {
    let doesExist = false;
    const member1Id = req.params.member1;
    const member2Id = req.params.member2;

    const allChats = await Chat.find({});
    const promise = allChats.map(async (cId) => {
      const chatObject = await Chat.findById(cId);
      return chatObject;
    });

    const chats = await Promise.all(promise);

    chats.forEach((c) => {
      if (
        (c.member1 == member1Id && c.member2 == member2Id) ||
        (c.member1 == member2Id && c.member2 == member1Id)
      ) {
        doesExist = true;
        res.json(true);
        return;
      }
    });

    if (!doesExist) {
      res.json(false);
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getChat = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const chat = await Chat.findById(chatId);

    res.json(chat);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getUsersChats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const allChats = await Chat.find({});
    const promise = allChats.map(async (cId) => {
      const chatObject = await Chat.findById(cId);
      if (chatObject.member1 == userId || chatObject.member2 == userId) {
        return {
          chatObj: chatObject,
          member1Obj: await User.findById(chatObject.member1),
          member2Obj: await User.findById(chatObject.member2),
        };
      }
    });

    const chats = await Promise.all(promise);

    let chatsWithoutUndefinedObjects = [];

    chats.forEach((c) => {
      if (c != undefined) {
        chatsWithoutUndefinedObjects.push(c);
      }
    });

    res.json(chatsWithoutUndefinedObjects);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.addMessageToChat = async (req, res) => {
  try {
    const { senderId, receiverId, message, creationTime } = req.body;

    const allChats = await Chat.find({});

    const promise = allChats.map(async (cId) => {
      const chatObject = await Chat.findById(cId);
      return chatObject;
    });

    const chats = await Promise.all(promise);

    let newMessage = new Message();
    newMessage.sender = senderId;
    newMessage.message = message;
    newMessage.creationTime = creationTime;

    await newMessage.save();

    chats.forEach(async (c) => {
      if (
        (c.member1 == senderId && c.member2 == receiverId) ||
        (c.member1 == receiverId && c.member2 == senderId)
      ) {
        c.messages.push(newMessage);
        await c.save();
      }
    });

    res.status(200).json({
      successMessage: "Message sent successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getChatByMembers = async (req, res) => {
  try {
    const member1Id = req.params.member1;
    const member2Id = req.params.member2;

    const allChats = await Chat.find({});
    const promise = allChats.map(async (cId) => {
      const chatObject = await Chat.findById(cId);
      return chatObject;
    });

    const chats = await Promise.all(promise);

    chats.forEach((c) => {
      if (c.member1 == member1Id && c.member2 == member2Id) {
        res.json(c);
        return;
      }
    });

    res.json(null);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const member1Id = req.params.member1;
    const member2Id = req.params.member2;

    let chat = null;
    const allChats = await Chat.find({});
    const promise = allChats.map(async (cId) => {
      const chatObject = await Chat.findById(cId);
      if (
        (chatObject.member1 == member1Id && chatObject.member2 == member2Id) ||
        (chatObject.member1 == member2Id && chatObject.member2 == member1Id)
      ) {
        chat = chatObject;
      }
    });

    await Promise.all(promise);

    const promise2 = chat.messages.map(async (mId) => {
      const messageObject = await Message.findById(mId);
      return messageObject;
    });

    const messages = await Promise.all(promise2);

    res.json(messages);
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};
