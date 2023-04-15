const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat");
const { authenticateJWT } = require("../middleware/authenticator");

router.get(
  "/doesExist/:member1/:member2",
  chatController.getDoesChatExistResult
);
router.post("/:member1/:member2/create", chatController.createChat);
router.get("/:chatId", chatController.getChat);
router.get("/:userId/chats", chatController.getUsersChats);
router.post("/addMessage", chatController.addMessageToChat);
router.get("/loadByMembers/:member1/:member2", chatController.getChatByMembers);
router.get("/:member1/:member2/messages", chatController.getChatMessages);

module.exports = router;
