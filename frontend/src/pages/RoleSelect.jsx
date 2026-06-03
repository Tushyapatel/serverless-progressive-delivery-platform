import { Cloud, Shield, User } from "lucide-react";

function RoleSelect({ onSelect }) {
return ( <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">


  <div className="w-full max-w-5xl">

    {/* HEADER */}

    <div className="text-center mb-14">

      <div className="flex justify-center mb-6">
        <div className="bg-blue-600 p-5 rounded-3xl shadow-lg shadow-blue-500/20">
          <Cloud size={36} />
        </div>
      </div>

      <h1 className="text-5xl font-bold mb-4">
        Progressive Delivery Platform
      </h1>

      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        Secure deployment orchestration, progressive rollouts,
        traffic management and real-time infrastructure monitoring.
      </p>

    </div>

    {/* ROLE CARDS */}

    <div className="grid md:grid-cols-2 gap-8">

      {/* ADMIN */}

      <button
        onClick={() => onSelect("ADMIN")}
        className="
          bg-slate-900
          border border-slate-800
          rounded-3xl
          p-8
          text-left
          cursor-pointer
          shadow-lg
          hover:shadow-blue-500/10
          hover:border-blue-500
          hover:-translate-y-1
          transition-all
        "
      >

        <div className="bg-blue-600 w-fit p-4 rounded-2xl mb-6">
          <Shield size={30} />
        </div>

        <div className="inline-flex px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm mb-5">
          Full Access
        </div>

        <h2 className="text-3xl font-bold mb-4">
          Administrator
        </h2>

        <p className="text-slate-400 mb-8 leading-relaxed">
          Full platform access including deployment creation,
          rollout management, rollback operations, analytics
          and infrastructure monitoring.
        </p>

        <div className="text-blue-400 font-semibold text-lg">
          Continue as Administrator →
        </div>

      </button>

      {/* USER */}

      <button
        onClick={() => onSelect("USER")}
        className="
          bg-slate-900
          border border-slate-800
          rounded-3xl
          p-8
          text-left
          cursor-pointer
          shadow-lg
          hover:shadow-emerald-500/10
          hover:border-emerald-500
          hover:-translate-y-1
          transition-all
        "
      >

        <div className="bg-emerald-600 w-fit p-4 rounded-2xl mb-6">
          <User size={30} />
        </div>

        <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm mb-5">
          Read & Monitor
        </div>

        <h2 className="text-3xl font-bold mb-4">
          Developer
        </h2>

        <p className="text-slate-400 mb-8 leading-relaxed">
          Monitor deployments, review rollout progress,
          inspect analytics, view infrastructure health
          and track platform activity.
        </p>

        <div className="text-emerald-400 font-semibold text-lg">
          Continue as Developer →
        </div>

      </button>

    </div>

    {/* FOOTER */}

    <div className="text-center mt-12 text-slate-500 text-sm">
      Serverless Progressive Delivery Platform • v1.0
    </div>

  </div>

</div>


);
}

export default RoleSelect;
