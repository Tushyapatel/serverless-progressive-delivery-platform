import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AnalyticsChart({ deployments }) {
  const data = deployments.map((deployment, index) => ({
    name: deployment.version,
    traffic: deployment.trafficPercentage,
    index,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Deployment Traffic Analytics
        </h2>

        <p className="text-slate-400">
          Progressive rollout telemetry across deployments
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart
  data={data}
  margin={{
    top: 10,
    right: 30,
    left: 30,
    bottom: 0,
  }}
>
            <defs>
              <linearGradient
                id="trafficGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3B82F6"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

           <XAxis
  dataKey="name"
  stroke="#94A3B8"
  padding={{
    left: 20,
    right: 20,
  }}
/>

            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                border: "1px solid #1E293B",
                borderRadius: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="traffic"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#trafficGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsChart;