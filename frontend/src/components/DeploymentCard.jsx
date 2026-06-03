import { motion } from "framer-motion";

import {
  Rocket,
  RotateCcw,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  Trash2,
} from "lucide-react";

function DeploymentCard({
  deployment,
  onStartRollout,
  onRollback,
  onDelete,
}) {
  const role =
  localStorage.getItem("role");

  const getStatusStyles = () => {
    switch (deployment.status) {
      case "COMPLETED":
        return {
          badge:
            "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
          glow: "shadow-emerald-500/10",
          icon: <CheckCircle2 size={18} />,
        };

      case "ROLLED_BACK":
        return {
          badge:
            "bg-red-500/20 text-red-400 border border-red-500/30",
          glow: "shadow-red-500/10",
          icon: <XCircle size={18} />,
        };

      case "ROLLING_OUT":
        return {
          badge:
            "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
          glow: "shadow-yellow-500/10",
          icon: (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          ),
        };

      default:
        return {
          badge:
            "bg-blue-500/20 text-blue-400 border border-blue-500/30",
          glow: "shadow-blue-500/10",
          icon: <Rocket size={18} />,
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.01,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl ${statusStyles.glow}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_40%)]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">
              {deployment.version}
            </h2>

            <p className="text-slate-500 text-sm break-all max-w-xs">
              {deployment.deploymentId}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-xl ${statusStyles.badge}`}
          >
            {statusStyles.icon}
            {deployment.status}
          </div>
        </div>

        <div className="mt-4 space-y-2 mb-6">
      <p className="text-sm text-slate-400">
  Duration:
  <span className="ml-2 text-emerald-400 font-semibold">
    {deployment.duration
      ? `${deployment.duration}s`
      : deployment.pipelineStatus ===
        "RUNNING"
      ? "RUNNING"
      : deployment.pipelineStatus ===
        "FAILED"
      ? "FAILED"
      : "NOT_STARTED"}
  </span>
</p>
          <p className="text-sm text-slate-400">
            Pipeline:
            <span className="ml-2 text-cyan-400 font-semibold">
              {deployment.pipelineStatus ||
                "NOT_STARTED"}
            </span>
          </p>

         <div className="mt-5">
  <p className="text-sm text-slate-400 mb-2">
    Pipeline Stage
  </p>

  <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
    <p className="text-cyan-400 font-bold text-sm tracking-wide">
      {deployment.currentStage || "NOT_STARTED"}
    </p>

    <p className="text-xs text-slate-500 mt-1">
      Status:
      <span
        className={`ml-2 font-semibold ${
          deployment.pipelineStatus ===
          "FAILED"
            ? "text-red-400"
            : deployment.pipelineStatus ===
              "SUCCESS"
            ? "text-emerald-400"
            : "text-yellow-400"
        }`}
      >
        {deployment.pipelineStatus ||
          "IDLE"}
      </span>
    </p>
  </div>
</div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-3">
            <span className="text-slate-400 font-medium">
              Progressive Traffic Shift
            </span>

            <span className="text-2xl font-bold">
              {deployment.trafficPercentage}%
            </span>
          </div>

          <div className="relative w-full bg-slate-800/80 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${deployment.trafficPercentage}%`,
              }}
              transition={{
                duration: 1,
              }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 shadow-lg shadow-blue-500/30"
            />
          </div>
        </div>

        <div className="mb-10 relative">
          <div className="absolute top-3 left-0 right-0 h-1 bg-slate-800 rounded-full" />

          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${deployment.trafficPercentage}%`,
            }}
            transition={{ duration: 1 }}
            className="absolute top-3 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
          />

          <div className="relative flex justify-between">
            {[
              { label: "CREATED", value: 0 },
              { label: "5%", value: 5 },
              { label: "25%", value: 25 },
              { label: "50%", value: 50 },
              { label: "COMPLETED", value: 100 },
            ].map((step) => {
              const active =
                deployment.status === "COMPLETED"
                  ? true
                  : deployment.trafficPercentage >=
                    step.value;

              return (
                <div
                  key={step.label}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-6 h-6 rounded-full border-4 z-10 bg-slate-950 transition-all duration-500 ${
                      active
                        ? "border-blue-400 shadow-lg shadow-blue-500/50"
                        : "border-slate-700"
                    }`}
                  />

                  <span className="text-xs text-slate-500 mt-3">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

     <div className="flex gap-4">

  {role === "ADMIN" && (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() =>
        onDelete(deployment.deploymentId)
      }
      className="flex-1 bg-slate-800 hover:bg-slate-700 transition-all py-4 rounded-2xl font-semibold flex items-center justify-center gap-3"
    >
      <Trash2 size={20} />
      Delete
    </motion.button>
  )}

  {role === "ADMIN" && (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() =>
        onStartRollout(
          deployment.deploymentId
        )
      }
      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
    >
      <Rocket size={20} />
      Start Rollout
    </motion.button>
  )}

  {role === "ADMIN" && (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() =>
        onRollback(
          deployment.deploymentId
        )
      }
      className="flex-1 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 transition-all py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg shadow-red-500/20"
    >
      <RotateCcw size={20} />
      Rollback
    </motion.button>
  )}

</div>
      </div>
    </motion.div>
  );
}

export default DeploymentCard;