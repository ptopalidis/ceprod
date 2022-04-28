const { Router } = require('express');
var express = require('express')
var router = express.Router();

const tokenController = require("../controllers/token.controller");

router.get("/authUrl",tokenController.getAuthUrl)
router.post("/generateToken",tokenController.generateToken)


module.exports = router;