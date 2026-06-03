import { Cloud, Activity } from "lucide-react";

function Navbar() {

  const role =
    localStorage.getItem("role");

  const handleLogout = () => {

    localStorage.clear();

    window.location.reload();

  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="bg-blue-600 p-2 rounded-xl">
            <Cloud size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              Progressive Delivery Platform
            </h1>

            <p className="text-slate-400 text-sm">
              Cloud Deployment Orchestration
            </p>
          </div>

        </div>

        <div className="flex items-center gap-4">

          <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="text-blue-400 text-sm font-semibold">
              {role}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
            <Activity
              size={16}
              className="text-emerald-400"
            />

            <span className="text-emerald-400 text-sm font-medium">
              System Operational
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;