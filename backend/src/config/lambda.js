const { LambdaClient } = require("@aws-sdk/client-lambda");

const lambdaClient = new LambdaClient({
  region: "ap-south-1",
});

module.exports = lambdaClient;