const express = require("express");

const {
  createDeployment,
  getDeployments,
  updateTraffic,
} = require("../controllers/deploymentController");

const router = express.Router();

router.post("/", createDeployment);
router.get("/", getDeployments);
router.patch("/:id/traffic", updateTraffic);

module.exports = router;