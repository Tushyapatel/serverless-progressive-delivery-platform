const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
});

module.exports = dynamoClient;