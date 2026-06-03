const crypto = require("crypto");

const {
  DynamoDBDocumentClient,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const dynamoClient =
  require("../config/dynamodb");

const docClient =
  DynamoDBDocumentClient.from(
    dynamoClient
  );

const createAuditLog = async (
  user,
  action,
  deploymentId
) => {

  await docClient.send(
    new PutCommand({
      TableName:
        "deployment-audit-logs",

      Item: {
        logId:
          crypto.randomUUID(),

        user,
        action,
        deploymentId,

        timestamp:
          new Date().toISOString(),
      },
    })
  );

  console.log(
    `AUDIT LOG: ${action}`
  );
};

module.exports = {
  createAuditLog,
};