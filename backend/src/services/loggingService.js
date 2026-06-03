const {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
} = require("@aws-sdk/client-cloudwatch-logs");

const client = new CloudWatchLogsClient({
  region: "ap-south-1",
});

const LOG_GROUP = "deployment-platform-logs";
const LOG_STREAM = "deployment-events";

const initializeLogging = async () => {
  try {
    await client.send(
      new CreateLogGroupCommand({
        logGroupName: LOG_GROUP,
      })
    );
  } catch (error) {}

  try {
    await client.send(
      new CreateLogStreamCommand({
        logGroupName: LOG_GROUP,
        logStreamName: LOG_STREAM,
      })
    );
  } catch (error) {}
};

const logEvent = async (message) => {
  try {
    const timestamp = Date.now();

    await client.send(
      new PutLogEventsCommand({
        logGroupName: LOG_GROUP,
        logStreamName: LOG_STREAM,
        logEvents: [
          {
            message,
            timestamp,
          },
        ],
      })
    );

    console.log("CloudWatch log sent:", message);
  } catch (error) {
    console.error("Logging error:", error.message);
  }
};

module.exports = {
  initializeLogging,
  logEvent,
};