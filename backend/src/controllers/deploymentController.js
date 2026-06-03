const { v4: uuidv4 } = require("uuid");

const {
  createAuditLog,
} = require(
  "../services/auditLogService"
);

const {
  uploadArtifact,
} = require("../services/artifactService");

const {
  startProgressiveRollout,
} = require("../services/rolloutService");
const {
  invokeRolloutLambda,
} = require("../services/lambdaService");
const {
  startPipeline,
} = require("../services/pipelineService");

const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const dynamoClient = require("../config/dynamodb");

const docClient = DynamoDBDocumentClient.from(dynamoClient);

const createDeployment = async (req, res) => {
  try {
const deploymentId = uuidv4();

const version =
  req.body.version || "v1";

const artifactUrl =
  await uploadArtifact(
    deploymentId,
    version
  );

const deployment = {
  deploymentId,
  version,

  artifactUrl,

  status: "CREATED",

  trafficPercentage: 0,

  pipelineStatus: "NOT_STARTED",

  currentStage: "NONE",

  createdAt:
    new Date().toISOString(),
};
    await docClient.send(
      new PutCommand({
        TableName: "deployments",
        Item: deployment,
      })
    );
    await createAuditLog(
  req.user.email,
  "CREATE_DEPLOYMENT",
  deploymentId
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
 
const updateTraffic = async (req, res) => {
  try {
    const { id } = req.params;
    const { trafficPercentage } = req.body;

    const result = await docClient.send(
      new UpdateCommand({
        TableName: "deployments",
        Key: {
          deploymentId: id,
        },
        UpdateExpression:
          "SET trafficPercentage = :trafficPercentage",
        ExpressionAttributeValues: {
          ":trafficPercentage": trafficPercentage,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    res.status(200).json({
      success: true,
      deployment: result.Attributes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update traffic",
      error: error.message,
    });
  }
};

const rollbackDeployment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await docClient.send(
      new UpdateCommand({
        TableName: "deployments",
        Key: {
          deploymentId: id,
        },
        UpdateExpression:
          "SET trafficPercentage = :traffic, #status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":traffic": 0,
          ":status": "ROLLED_BACK",
        },
        ReturnValues: "ALL_NEW",
      })
    );
await createAuditLog(
  req.user.email,
  "ROLLBACK_DEPLOYMENT",
  id
);
    res.status(200).json({
      success: true,
      message: "Deployment rolled back successfully",
      deployment: result.Attributes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Rollback failed",
      error: error.message,
    });
  }
};

const startRollout = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("NEW STARTROLLOUT RUNNING");

    const deploymentData = await docClient.send(
      new GetCommand({
        TableName: "deployments",
        Key: {
          deploymentId: id,
        },
      })
    );

    const deployment = deploymentData.Item;

    if (!deployment) {
      return res.status(404).json({
        success: false,
        message: "Deployment not found",
      });
    }

    // BLOCK duplicate rollout
    if (
      deployment.status === "ROLLING_OUT" ||
      deployment.status === "COMPLETED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Deployment already rolling out or completed",
      });
    }

    // instantly set status
    await docClient.send(
      new UpdateCommand({
        TableName: "deployments",
        Key: {
          deploymentId: id,
        },
        UpdateExpression:
          "SET #status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": "ROLLING_OUT",
        },
      })
    );

    const io = req.app.get("io");

   // LOCAL rollout engine
startProgressiveRollout(id, io);

await createAuditLog(
  req.user.email,
  "START_ROLLOUT",
  id
);

// AWS Lambda test
await invokeRolloutLambda(id);

    res.status(200).json({
      success: true,
      message: "Progressive rollout started",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to start rollout",
      error: error.message,
    });
  }
};

const deleteDeployment = async (req, res) => {
  try {
    const { id } = req.params;

    await docClient.send(
      new DeleteCommand({
        TableName: "deployments",
        Key: {
          deploymentId: id,
        },
      })
    );

    res.status(200).json({
      success: true,
      message: "Deployment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete deployment",
      error: error.message,
    });
  }
};
module.exports = {
  createDeployment,
  getDeployments,
  updateTraffic,
  rollbackDeployment,
  startRollout,
  deleteDeployment,
};