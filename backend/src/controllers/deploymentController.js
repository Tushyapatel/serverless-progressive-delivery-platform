const { v4: uuidv4 } = require("uuid");

const createDeployment = async (req, res) => {
  try {
    const deployment = {
      deploymentId: uuidv4(),
      version: req.body.version || "v1",
      status: "CREATED",
      trafficPercentage: 0,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      deployment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create deployment",
    });
  }
};

module.exports = {
  createDeployment,
};