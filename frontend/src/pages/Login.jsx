import { useState } from "react";
import { Cloud, ShieldCheck, Activity } from "lucide-react";
import API from "../api/api";

function Login({
onLogin,
selectedRole,
}) {

const [email, setEmail] =
useState("");

const [password, setPassword] =
useState("");

const [error, setError] =
useState("");

const handleLogin = async () => {


try {

  const response =
    await API.post(
      "/api/auth/login",
      {
        email,
        password,
      }
    );

  if (
    response.data.role !==
    selectedRole
  ) {

    setError(
      "Selected role does not match account role"
    );

    return;
  }

  localStorage.setItem(
    "token",
    response.data.token
  );

  localStorage.setItem(
    "role",
    response.data.role
  );

  onLogin();

} catch {

  setError(
    "Invalid credentials"
  );

}


};

return (


<div className="min-h-screen bg-slate-950 text-white">

  <div className="grid lg:grid-cols-2 min-h-screen">

    {/* LEFT SIDE */}

    <div className="hidden lg:flex flex-col justify-center px-16">

      <div className="mb-8">

        <div className="bg-blue-600 p-4 rounded-2xl w-fit mb-6">
          <Cloud size={36} />
        </div>

        <h1 className="text-5xl font-bold mb-4">
          Progressive Delivery Platform
        </h1>

        <p className="text-slate-400 text-lg">
          Secure deployment orchestration,
          rollout automation and infrastructure monitoring.
        </p>

      </div>

      <div className="space-y-6">

        <div className="flex items-center gap-4">
          <ShieldCheck className="text-blue-400" />
          <span className="text-slate-300">
            Enterprise-grade deployment security
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Activity className="text-emerald-400" />
          <span className="text-slate-300">
            Real-time deployment monitoring
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Cloud className="text-cyan-400" />
          <span className="text-slate-300">
            Progressive rollout management
          </span>
        </div>

      </div>

    </div>

    {/* RIGHT SIDE */}

    <div className="flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8">

        <div className="mb-8">

          <h2 className="text-3xl font-bold mb-3">
            Sign In
          </h2>

          <div
            className={
              selectedRole === "ADMIN"
                ? "inline-flex px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm"
                : "inline-flex px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm"
            }
          >
            {selectedRole} ACCESS
          </div>

        </div>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-xl
              bg-slate-800
              border
              border-slate-700
              focus:outline-none
              focus:border-blue-500
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-xl
              bg-slate-800
              border
              border-slate-700
              focus:outline-none
              focus:border-blue-500
            "
          />

        </div>

        {error && (

          <p className="text-red-400 mt-4">
            {error}
          </p>

        )}

        <button
          onClick={handleLogin}
          className="
            w-full
            mt-6
            bg-blue-600
            hover:bg-blue-700
            py-4
            rounded-xl
            font-semibold
            transition-all
          "
        >
          Login
        </button>

      </div>

    </div>

  </div>

</div>


);
}

export default Login;
