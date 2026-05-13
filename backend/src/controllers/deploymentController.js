const { v4: uuidv4 } = require("uuid");

const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const dynamoClient = require("../config/dynamodb");

const docClient = DynamoDBDocumentClient.from(dynamoClient);

const createDeployment = async (req, res) => {
  try {
    const deployment = {
      deploymentId: uuidv4(),
      version: req.body.version || "v1",
      status: "CREATED",
      trafficPercentage: 0,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: "deployments",
        Item: deployment,
      })
    );

    res.status(201).json({
      success: true,
      deployment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create deployment",
      error: error.message,
    });
  }
};

const getDeployments = async (req, res) => {
  try {
    const data = await docClient.send(
      new ScanCommand({
        TableName: "deployments",
      })
    );

    res.status(200).json({
      success: true,
      deployments: data.Items || [],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch deployments",
      error: error.message,
    });
  }
};

module.exports = {
  createDeployment,
  getDeployments,
};