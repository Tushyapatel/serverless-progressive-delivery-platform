const {
  SNSClient,
  PublishCommand,
} = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({
  region: "ap-south-1",
});

const TOPIC_ARN =
  "arn:aws:sns:ap-south-1:691768189668:deployment-alerts";

const sendNotification = async (
  subject,
  message
) => {
  try {
    await snsClient.send(
      new PublishCommand({
        TopicArn: TOPIC_ARN,
        Subject: subject,
        Message: message,
      })
    );

    console.log(
    
  `SNS sent successfully: ${subject}`

    );
  } catch (error) {
    console.error(
      "SNS Error:",
      error
    );
  }
};

module.exports = {
  sendNotification,
};