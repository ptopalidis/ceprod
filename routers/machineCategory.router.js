const { Router } = require('express');
var express = require('express')
var router = express.Router();

const machineCategoryController = require("../controllers/machineCategory.controller");


router.post("/",machineCategoryController.createMachineCategory)
router.get("/all",machineCategoryController.getAllMachineCategories)


module.exports = router;