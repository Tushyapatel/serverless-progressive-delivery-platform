import { motion } from "framer-motion";

function ActivityFeed({ deployments }) {
  const activities = deployments.flatMap((deployment) => {
    const logs = [];

    logs.push({
      id: `${deployment.deploymentId}-created`,
      message: `${deployment.version} deployment created`,
      status: "CREATED",
    });

    if (deployment.trafficPercentage >= 5) {
      logs.push({
  id: `${deployment.deploymentId}-imbalance`,
  message:
    "Traffic imbalance detected in eu-west-1",
  status: "WARNING",
});
if (deployment.trafficPercentage >= 50) {
  logs.push({
    id: `${deployment.deploymentId}-latency`,
    message:
      "Latency spike anomaly detected",
    status: "WARNING",
  });

  logs.push({
    id: `${deployment.deploymentId}-ai-risk`,
    message:
      "AI risk escalated to HIGH",
    status: "CRITICAL",
  });
}
      logs.push({
        id: `${deployment.deploymentId}-5`,
        message: `${deployment.version} shifted to 5% traffic`,
        status: "ROLLING_OUT",
      });
    }

    if (deployment.trafficPercentage >= 25) {
      logs.push({
        id: `${deployment.deploymentId}-25`,
        message: `${deployment.version} shifted to 25% traffic`,
        status: "ROLLING_OUT",
      });
    }

    if (deployment.status === "COMPLETED") {
      logs.push({
        id: `${deployment.deploymentId}-complete`,
        message: `${deployment.version} deployment completed`,
        status: "COMPLETED",
      });
    }

    if (deployment.status === "ROLLED_BACK") {
      logs.push({
        id: `${deployment.deploymentId}-rollback`,
        message: `${deployment.version} rollback triggered`,
        status: "ROLLED_BACK",
      });
    }

    return logs;
  });

  const getStatusColor = (status) => {
    
    switch (status) {
      case "WARNING":
  return "bg-yellow-500";

case "CRITICAL":
  return "bg-red-500";
      case "COMPLETED":
        return "bg-emerald-500";

      case "ROLLED_BACK":
        return "bg-red-500";

      case "ROLLING_OUT":
        return "bg-yellow-500";

      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Live Deployment Activity
        </h2>

        <p className="text-slate-400">
          Real-time rollout telemetry and deployment events
        </p>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {activities.reverse().map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-4"
          >
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(
                activity.status
              )} animate-pulse`}
            />

            <div>
              <p className="font-medium">
                {activity.message}
              </p>

              <p className="text-slate-500 text-sm">
                {activity.status}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;