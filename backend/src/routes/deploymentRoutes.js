const express = require("express");

const {
  createDeployment,
  getDeployments,
  updateTraffic,
  rollbackDeployment,
  startRollout,
  deleteDeployment,
} = require("../controllers/deploymentController");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/",
  getDeployments
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createDeployment
);

router.patch(
  "/:id/traffic",
  authMiddleware,
  adminMiddleware,
  updateTraffic
);

router.patch(
  "/:id/rollback",
  authMiddleware,
  adminMiddleware,
  rollbackDeployment
);

router.post(
  "/:id/start-rollout",
  authMiddleware,
  adminMiddleware,
  startRollout
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteDeployment
);

module.exports = router;