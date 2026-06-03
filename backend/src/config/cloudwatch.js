const {
  CloudWatchClient,
} = require("@aws-sdk/client-cloudwatch");

const cloudwatch =
  new CloudWatchClient({
    region: "ap-south-1",
  });

module.exports = cloudwatch;