const { Router } = require('express');
var express = require('express')
var router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/all",userController.getAllUsers)
router.post("/authenticate",userController.authenticateUser);
router.get("/:userID/machines",userController.getUserMachines)
router.get("/:userID",userController.getUserByID)
router.put("/:userID",userController.updateUser)


module.exports = router;