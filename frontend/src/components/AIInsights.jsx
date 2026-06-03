import { motion } from "framer-motion";

import {
  BrainCircuit,
  AlertTriangle,
  ShieldCheck,
  Activity,
} from "lucide-react";

function AIInsights({ deployments }) {
  const latestDeployment = deployments[0];

  const traffic =
    latestDeployment?.trafficPercentage || 0;

  const status =
    latestDeployment?.status || "CREATED";

  let riskLevel = "LOW";
  let rollbackProbability = 8;
  let recommendation =
    "Deployment stability healthy";
  let anomaly =
    "No deployment anomalies detected";

  if (traffic >= 25) {
    riskLevel = "MEDIUM";
    rollbackProbability = 34;
    recommendation =
      "Monitor rollout telemetry closely";
    anomaly =
      "Traffic imbalance detected in eu-west-1";
  }

  if (traffic >= 50) {
    riskLevel = "HIGH";
    rollbackProbability = 67;
    recommendation =
      "High latency anomaly detected. Pause rollout.";
    anomaly =
      "Elevated latency spike in eu-west-1";
  }

  if (status === "ROLLED_BACK") {
    riskLevel = "CRITICAL";
    rollbackProbability = 91;
    recommendation =
      "Rollback executed successfully. Investigate deployment integrity.";
    anomaly =
      "Deployment health degradation detected across regions";
  }

  const getRiskStyles = () => {
    switch (riskLevel) {
      case "CRITICAL":
        return {
          badge:
            "bg-red-500/20 text-red-400 border border-red-500/30",
          glow: "shadow-red-500/10",
          pulse: "bg-red-400",
        };

      case "HIGH":
        return {
          badge:
            "bg-orange-500/20 text-orange-400 border border-orange-500/30",
          glow: "shadow-orange-500/10",
          pulse: "bg-orange-400",
        };

      case "MEDIUM":
        return {
          badge:
            "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
          glow: "shadow-yellow-500/10",
          pulse: "bg-yellow-400",
        };

      default:
        return {
          badge:
            "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
          glow: "shadow-emerald-500/10",
          pulse: "bg-emerald-400",
        };
    }
  };

  const styles = getRiskStyles();

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl ${styles.glow} relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_40%)]" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-violet-500/20 p-4 rounded-2xl">
            <BrainCircuit
              className="text-violet-400"
              size={32}
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              AI Deployment Intelligence
            </h2>

            <p className="text-slate-400">
              Live predictive rollout analysis engine
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={28} />

              <div
                className={`px-4 py-2 rounded-full text-sm font-bold ${styles.badge}`}
              >
                {riskLevel} RISK
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3">
              Rollback Probability
            </h3>

            <p className="text-5xl font-black">
              {rollbackProbability}%
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity size={28} />

              <div
                className={`w-3 h-3 rounded-full ${styles.pulse} animate-pulse`}
              />
            </div>

            <h3 className="text-xl font-bold mb-3">
              Detected Anomaly
            </h3>

            <p className="text-slate-300 leading-relaxed">
              {anomaly}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <ShieldCheck size={28} />

              <div
                className={`w-3 h-3 rounded-full ${styles.pulse} animate-pulse`}
              />
            </div>

            <h3 className="text-xl font-bold mb-3">
              AI Recommendation
            </h3>

            <p className="text-slate-300 leading-relaxed">
              {recommendation}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AIInsights;