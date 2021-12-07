const { Router } = require('express');
var express = require('express')
var router = express.Router();

const messageController = require("../controllers/message.controller");


router.post("/",messageController.createMessage)
router.get("/users/:userID",messageController.getUserMessages)
router.get("/users/:userID/count",messageController.getUserUnreadMessagesCount)
router.put("/:messageID/read",messageController.markMessageAsRead)


module.exports = router;