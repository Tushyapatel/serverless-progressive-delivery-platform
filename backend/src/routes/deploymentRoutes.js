const express = require("express");

const {
  createDeployment,
  getDeployments,
  updateTraffic,
  rollbackDeployment,
} = require("../controllers/deploymentController");

const router = express.Router();

router.post("/", createDeployment);
router.get("/", getDeployments);
router.patch("/:id/traffic", updateTraffic);
router.patch("/:id/rollback", rollbackDeployment);

module.exports = router;