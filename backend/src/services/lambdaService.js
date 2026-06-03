const {
  LambdaClient,
  InvokeCommand,
} = require("@aws-sdk/client-lambda");

const client = new LambdaClient({
  region: "ap-south-1",
});

const invokeRolloutLambda = async (
  deploymentId
) => {
  const payload = JSON.stringify({
    deploymentId,
  });

  const command = new InvokeCommand({
    FunctionName: "rolloutEngine",
    Payload: Buffer.from(payload),
  });

  const response =
    await client.send(command);

  console.log(
    "Lambda invoked:",
    response.StatusCode
  );

  return response;
};

module.exports = {
  invokeRolloutLambda,
};