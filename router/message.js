const express = require("express");
const MessageController = require("../controllers/messageController");
const router = express.Router();

router.post("/new", MessageController.newMessage.bind(MessageController));

module.exports = router;
