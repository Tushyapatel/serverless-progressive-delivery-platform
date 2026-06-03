const { logEvent } = require("./loggingService");

const {
  sendNotification,
} = require("./notificationService");

const {
  sendMetric,
} = require("./metricsService");

const {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const dynamoClient = require("../config/dynamodb");

const docClient =
  DynamoDBDocumentClient.from(dynamoClient);

const rolloutStages = [5, 25, 50, 100];

const rollbackDeployment = async (
  deploymentId,
  io
) => {
  await docClient.send(
    new UpdateCommand({
      TableName: "deployments",

      Key: {
        deploymentId,
      },

      UpdateExpression:
        "SET trafficPercentage = :traffic, #status = :status, pipelineStatus = :pipelineStatus, currentStage = :currentStage",

      ExpressionAttributeNames: {
        "#status": "status",
      },

      ExpressionAttributeValues: {
        ":traffic": 0,
        ":status": "ROLLED_BACK",
        ":pipelineStatus": "ROLLED_BACK",
        ":currentStage": "ROLLBACK",
      },
    })
  );

  console.log(
    `Deployment ${deploymentId} rolled back`
  );

  io.emit(
    "logEvent",
    `Deployment ${deploymentId} rolled back`
  );

  io.emit("deploymentUpdated", {
    deploymentId,
    traffic: 0,
    status: "ROLLED_BACK",
    pipelineStatus: "ROLLED_BACK",
    currentStage: "ROLLBACK",
  });

  await logEvent(
    `Deployment ${deploymentId} rolled back`
  );
 
await sendNotification(
  "Deployment Rolled Back",
  `Deployment ${deploymentId} was rolled back`
);
await sendMetric(
  "RollbackCount",
  1
);

};

const startProgressiveRollout = async (
  deploymentId,
  io
) => {
  console.log(
    "NEW STARTROLLOUT RUNNING"
  );

  const deploymentData = await docClient.send(
    new GetCommand({
      TableName: "deployments",

      Key: {
        deploymentId,
      },
    })
  );

  const deployment = deploymentData.Item;

  const rolloutStartTime = Date.now();

  const pipelineStages = [
    "BUILDING",
    "UNIT_TESTS",
    "INTEGRATION_TESTS",
    "SECURITY_SCAN",
    "CANARY_DEPLOY",
  ];

  // PIPELINE STAGES
  for (const stage of pipelineStages) {

    // CHECK IF ROLLED BACK
    const latestDeployment =
      await docClient.send(
        new GetCommand({
          TableName: "deployments",
          Key: {
            deploymentId,
          },
        })
      );

    if (
      latestDeployment.Item.status ===
      "ROLLED_BACK"
    ) {
      console.log(
        `Deployment ${deploymentId} already rolled back`
      );

      return;
    }

    await docClient.send(
      new UpdateCommand({
        TableName: "deployments",

        Key: {
          deploymentId,
        },

        UpdateExpression:
          "SET pipelineStatus = :pipelineStatus, currentStage = :currentStage, startedAt = :startedAt",

        ExpressionAttributeValues: {
          ":pipelineStatus": "RUNNING",
          ":currentStage": stage,
          ":startedAt":
            new Date().toISOString(),
        },
      })
    );

    io.emit("deploymentUpdated", {
      deploymentId,
      pipelineStatus: "RUNNING",
      currentStage: stage,
      traffic:
        deployment.trafficPercentage || 0,
      status: "ROLLING_OUT",
    });

    console.log(
      `Deployment ${deploymentId} ${stage}`
    );

    io.emit(
      "logEvent",
      `Deployment ${deploymentId} ${stage}`
    );

    await new Promise((resolve) =>
      setTimeout(
        resolve,
        1000 + Math.random() * 2500
      )
    );
    // STOP IMMEDIATELY AFTER ROLLBACK

const rollbackCheck =
  await docClient.send(
    new GetCommand({
      TableName: "deployments",
      Key: {
        deploymentId,
      },
    })
  );

if (
  rollbackCheck.Item.status ===
  "ROLLED_BACK"
) {

  console.log(
    `Deployment ${deploymentId} fully stopped after rollback`
  );

  return;
}
  }

  
 // TRAFFIC ROLLOUT
for (const traffic of rolloutStages) {

  // CHECK ROLLBACK BEFORE STARTING
  let latestDeployment =
    await docClient.send(
      new GetCommand({
        TableName: "deployments",
        Key: {
          deploymentId,
        },
      })
    );

  if (
    latestDeployment.Item.status ===
    "ROLLED_BACK"
  ) {
    console.log(
      `Deployment ${deploymentId} stopped due to rollback`
    );

    return;
  }

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
        ":currentStage": `Testing ${traffic}%`,
      },
    })
  );

  io.emit("deploymentUpdated", {
    deploymentId,
    pipelineStatus: "RUNNING",
    currentStage: `Testing ${traffic}%`,
    traffic,
    status: "ROLLING_OUT",
  });

  console.log(
    `Deployment ${deploymentId} testing ${traffic}%`
  );

  io.emit(
    "logEvent",
    `Deployment ${deploymentId} testing ${traffic}%`
  );

  await new Promise((resolve) =>
    setTimeout(
      resolve,
      1000 + Math.random() * 1200
    )
  );

  // CHECK AGAIN AFTER WAIT
  latestDeployment =
    await docClient.send(
      new GetCommand({
        TableName: "deployments",
        Key: {
          deploymentId,
        },
      })
    );

  if (
    latestDeployment.Item.status ===
    "ROLLED_BACK"
  ) {
    console.log(
      `Deployment ${deploymentId} stopped after rollback`
    );

    return;
  }

  let isHealthy = true;

  if (traffic !== 100) {
    const randomFailureChance =
      Math.random();

    if (randomFailureChance < 0.3) {
      isHealthy = false;
    }
  }

  // FAILURE
  if (!isHealthy) {

    const failedDuration = (
      (Date.now() -
        rolloutStartTime) /
      1000
    ).toFixed(1);

    await docClient.send(
      new UpdateCommand({
        TableName: "deployments",

        Key: {
          deploymentId,
        },

        UpdateExpression:
          "SET trafficPercentage = :traffic, #status = :status, pipelineStatus = :pipelineStatus, currentStage = :currentStage, #duration = :duration",

        ExpressionAttributeNames: {
          "#status": "status",
          "#duration": "duration",
        },

        ExpressionAttributeValues: {
          ":traffic": 0,
         ":status": "FAILED",
          ":pipelineStatus": "FAILED",
          ":currentStage":
            "HEALTH_CHECK_FAILED",
          ":duration": failedDuration,
        },
      })
    );

    io.emit("deploymentUpdated", {
      deploymentId,
      traffic: 0,
      status:  "FAILED",
      pipelineStatus: "FAILED",
      currentStage:
        "HEALTH_CHECK_FAILED",
      duration: failedDuration,
    });
  await sendMetric(
  "DeploymentFailure",
  1
);

console.log("ABOUT TO SEND SNS EMAIL");

await sendNotification(
  "DEPLOYMENT FAILED TEST",
  `Deployment ${deploymentId} failed health checks`
);

console.log("SNS EMAIL FUNCTION FINISHED");


    

    return;
  }

  const status =
    traffic === 100
      ? "COMPLETED"
      : "ROLLING_OUT";

  const completedAt =
    traffic === 100
      ? new Date().toISOString()
      : null;

  const duration =
    traffic === 100
      ? (
          (Date.now() -
            rolloutStartTime) /
          1000
        ).toFixed(1)
      : null;

      const currentDeployment =
  await docClient.send(
    new GetCommand({
      TableName: "deployments",
      Key: {
        deploymentId,
      },
    })
  );

if (
  currentDeployment.Item.status ===
  "ROLLED_BACK"
) {
  console.log(
    `Deployment ${deploymentId} force stopped`
  );

  return;
}
  await docClient.send(
    new UpdateCommand({
      TableName: "deployments",

      Key: {
        deploymentId,
      },

      UpdateExpression:
        "SET trafficPercentage = :traffic, #status = :status, completedAt = :completedAt, #duration = :duration, pipelineStatus = :pipelineStatus, currentStage = :currentStage",

      ExpressionAttributeNames: {
        "#status": "status",
        "#duration": "duration",
      },

      ExpressionAttributeValues: {
        ":traffic": traffic,
        ":status": status,
        ":completedAt": completedAt,
        ":duration": duration,

        ":pipelineStatus":
          traffic === 100
            ? "SUCCESS"
            : "RUNNING",

        ":currentStage":
          traffic === 100
            ? "DEPLOYED"
            : `Testing ${traffic}%`,
      },
    })
  );

  io.emit("deploymentUpdated", {
    deploymentId,
    traffic,
    status,
    completedAt,
    duration,

    pipelineStatus:
      traffic === 100
        ? "SUCCESS"
        : "RUNNING",

    currentStage:
      traffic === 100
        ? "DEPLOYED"
        : `Testing ${traffic}%`,
  });

  console.log(
    `Deployment ${deploymentId} shifted to ${traffic}% traffic`
  );
await sendMetric(
  "TrafficShift",
  traffic
);
  io.emit(
    "logEvent",
    `Deployment ${deploymentId} shifted to ${traffic}% traffic`
  );

  await logEvent(
    `Deployment ${deploymentId} shifted to ${traffic}% traffic`
  );
  if (traffic === 100) {

  await sendMetric(
    "DeploymentSuccess",
    1
  );

  await sendMetric(
    "DeploymentDuration",
    Number(duration),
    "Seconds"
  );

  await sendNotification(
    "Deployment Successful",
    `Deployment ${deploymentId} completed successfully`
  );
}
}};

module.exports = {
  startProgressiveRollout,
};