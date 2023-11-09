const express = require("express");
const MessageController = require("../controllers/messageController");
const router = express.Router();

router.get("/", MessageController.getLastMessages.bind(MessageController));
router.post("/new", MessageController.newMessage.bind(MessageController));

module.exports = router;
