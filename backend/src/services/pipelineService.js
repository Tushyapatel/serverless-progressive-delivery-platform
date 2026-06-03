const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const dynamoClient = require("../config/dynamodb");

const docClient =
  DynamoDBDocumentClient.from(dynamoClient);

const pipelineStages = [
  "BUILD",
  "TEST",
  "SECURITY_SCAN",
  "DEPLOY",
];

const startPipeline = async (
  deploymentId,
  io
) => {
  for (const stage of pipelineStages) {
    await docClient.send(
      new UpdateCommand({
        TableName: "deployments",
        Key: {
          deploymentId,
        },
        UpdateExpression:
          "SET pipelineStatus = :pipelineStatus, currentStage = :currentStage",
        ExpressionAttributeValues: {
          ":pipelineStatus": "RUNNING",
          ":currentStage": stage,
        },
      })
    );

    io.emit("pipelineUpdated", {
      deploymentId,
      pipelineStatus: "RUNNING",
      currentStage: stage,
    });

    await new Promise((resolve) =>
      setTimeout(resolve, 3000)
    );

    const failed =
      Math.random() < 0.25;

    if (failed) {
      await docClient.send(
        new UpdateCommand({
          TableName: "deployments",
          Key: {
            deploymentId,
          },
          UpdateExpression:
            "SET pipelineStatus = :pipelineStatus, #status = :status",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":pipelineStatus": "FAILED",
            ":status": "PIPELINE_FAILED",
          },
        })
      );

      io.emit("pipelineUpdated", {
        deploymentId,
        pipelineStatus: "FAILED",
        currentStage: stage,
      });

      return false;
    }
  }

  await docClient.send(
    new UpdateCommand({
      TableName: "deployments",
      Key: {
        deploymentId,
      },
      UpdateExpression:
        "SET pipelineStatus = :pipelineStatus",
      ExpressionAttributeValues: {
        ":pipelineStatus": "SUCCESS",
      },
    })
  );

  io.emit("pipelineUpdated", {
    deploymentId,
    pipelineStatus: "SUCCESS",
    currentStage: "DEPLOY",
  });

  return true;
};

module.exports = {
  startPipeline,
};