import { motion } from "framer-motion";

import {
  Globe,
  Server,
  Database,
  Activity,
  Cloud,
} from "lucide-react";

function InfrastructureMap() {
  const infrastructure = [
    {
      title: "Frontend Dashboard",
      icon: Globe,
      description: "React + Tailwind Control Plane",
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Deployment API",
      icon: Server,
      description: "Express Orchestration Layer",
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "AWS DynamoDB",
      icon: Database,
      description: "Deployment State Persistence",
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "CloudWatch Logs",
      icon: Activity,
      description: "Observability + Telemetry",
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_40%)]" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-500/20 p-3 rounded-2xl">
            <Cloud className="text-blue-400" size={28} />
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              Cloud Infrastructure Topology
            </h2>

            <p className="text-slate-400">
              Progressive delivery orchestration architecture
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          {infrastructure.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center"
              >
                <motion.div
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                  className="relative flex-1"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 blur-2xl rounded-3xl`}
                  />

                  <div className="relative bg-slate-950/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl h-full">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-5 shadow-lg`}
                    >
                      <Icon size={32} />
                    </div>

                    <h3 className="text-xl font-bold mb-3">
                      {item.title}
                    </h3>

                    <p className="text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>

                {index !== infrastructure.length - 1 && (
                  <div className="hidden lg:flex flex-1 justify-center">
                    <motion.div
                      animate={{
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                      className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default InfrastructureMap;