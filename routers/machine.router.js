const { Router } = require('express');
var express = require('express')
var router = express.Router();

const machineController = require("../controllers/machine.controller");



router.get("/:machineID",machineController.getMachineByID)
router.post("/:machineID/files/delete",machineController.deleteMachineFile)
router.post("/:machineID/files/upload",machineController.uploadMachineFile)
router.put("/:machineID/files",machineController.updateMachineFiles)
router.post("/validateFile",machineController.validateFile)
router.post("/generateFileCode",machineController.generateFileCode)

module.exports = router;