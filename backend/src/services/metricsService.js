const {
  PutMetricDataCommand,
} = require("@aws-sdk/client-cloudwatch");

const cloudwatch =
  require("../config/cloudwatch");

const sendMetric = async (
  metricName,
  value,
  unit = "Count"
) => {

  try {

    await cloudwatch.send(
      new PutMetricDataCommand({
        Namespace:
          "ProgressiveDeliveryPlatform",

        MetricData: [
          {
            MetricName: metricName,

            Value: value,

            Unit: unit,

            Timestamp: new Date(),
          },
        ],
      })
    );

    console.log(
      `Metric sent: ${metricName}`
    );

  } catch (error) {

    console.error(
      "CloudWatch Metric Error:",
      error.message
    );
  }
};

module.exports = {
  sendMetric,
};