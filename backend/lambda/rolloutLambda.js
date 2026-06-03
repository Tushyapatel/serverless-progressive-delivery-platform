const {
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "ap-south-1",
});

const docClient =
  DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const deploymentId =
    event.deploymentId;

  console.log(
    "Lambda rollout started:",
    deploymentId
  );

  // Simulate rollout step
  await docClient.send(
    new UpdateCommand({
      TableName: "deployments",

      Key: {
        deploymentId,
      },

      UpdateExpression:
        "SET lambdaStatus = :status",

      ExpressionAttributeValues: {
        ":status":
          "LAMBDA_EXECUTED",
      },
    })
  );

  return {
    statusCode: 200,

    body: JSON.stringify({
      message:
        "Lambda rollout executed",
    }),
  };
};