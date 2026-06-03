function StatsCard({ title, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <p className="text-slate-400 text-sm mb-2">{title}</p>

      <h2 className={`text-4xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}

export default StatsCard;