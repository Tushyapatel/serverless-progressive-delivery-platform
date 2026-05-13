const express = require("express");

const {
  createDeployment,
} = require("../controllers/deploymentController");

const router = express.Router();

router.post("/", createDeployment);

module.exports = router;