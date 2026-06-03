const mongoose = require("mongoose");

const deploymentSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },

  version: {
    type: String,
    required: true,
  },

  environment: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Deployment", deploymentSchema);