import { motion } from "framer-motion";

function RegionMap({ deployments }) {
  const latestDeployment = deployments[0];

  const traffic =
    latestDeployment?.trafficPercentage || 0;

  const rolledBack =
    latestDeployment?.status === "ROLLED_BACK";

  const regions = [
    {
      name: "us-east-1",
      city: "Virginia",
      health: rolledBack
        ? "DEGRADED"
        : "HEALTHY",
      traffic: traffic >= 100 ? 100 : traffic,
      top: "30%",
      left: "18%",
    },

    {
      name: "eu-west-1",
      city: "Ireland",
      health:
        traffic >= 50
          ? "LATENCY_SPIKE"
          : rolledBack
          ? "DEGRADED"
          : "HEALTHY",
      traffic:
        traffic >= 25 ? traffic - 10 : traffic,
      top: "22%",
      left: "47%",
    },

    {
      name: "ap-south-1",
      city: "Mumbai",
      health:
        traffic >= 75
          ? "ROLLING_OUT"
          : "HEALTHY",
      traffic:
        traffic >= 50 ? traffic - 20 : traffic,
      top: "48%",
      left: "72%",
    },
  ];

  const getHealthStyles = (health) => {
    switch (health) {
      case "HEALTHY":
        return {
          dot: "bg-emerald-400",
          badge:
            "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        };

      case "ROLLING_OUT":
        return {
          dot: "bg-blue-400",
          badge:
            "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        };

      case "LATENCY_SPIKE":
        return {
          dot: "bg-yellow-400",
          badge:
            "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        };

      default:
        return {
          dot: "bg-red-400",
          badge:
            "bg-red-500/20 text-red-400 border border-red-500/30",
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_50%)]" />

      <div className="relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Global Deployment Regions
          </h2>

          <p className="text-slate-400">
            Live multi-region deployment orchestration
          </p>
        </div>

        <div className="relative h-[500px] bg-slate-950/60 border border-slate-800 rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2070&auto=format&fit=crop"
            alt="World Map"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />

          {regions.map((region) => {
            const styles = getHealthStyles(
              region.health
            );

            return (
              <motion.div
                key={region.name}
                initial={{
                  scale: 0.8,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                className="absolute"
                style={{
                  top: region.top,
                  left: region.left,
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                  className={`w-5 h-5 rounded-full ${styles.dot}`}
                />

                <div className="mt-4 w-56 bg-slate-900/95 border border-slate-700 rounded-2xl p-4 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">
                      {region.name}
                    </h3>

                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles.badge}`}
                    >
                      {region.health}
                    </div>
                  </div>

                  <p className="text-slate-400 mb-4">
                    {region.city}
                  </p>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">
                        Traffic Distribution
                      </span>

                      <span className="font-semibold">
                        {Math.max(region.traffic, 0)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                      <motion.div
                        animate={{
                          width: `${Math.max(
                            region.traffic,
                            0
                          )}%`,
                        }}
                        transition={{
                          duration: 1,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RegionMap;