import { useEffect, useState } from "react";

import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import StatsCard from "./components/StatsCard";
import DeploymentCard from "./components/DeploymentCard";
import AnalyticsChart from "./components/AnalyticsChart";
import ActivityFeed from "./components/ActivityFeed";
import InfrastructureMap from "./components/InfrastructureMap";
import RegionMap from "./components/RegionMap";
import AIInsights from "./components/AIInsights";
import CreateDeploymentForm from "./components/CreateDeploymentForm";


import API from "./api/api";
import socket from "./socket/socket";

function App() {

  const [selectedRole, setSelectedRole] =
  useState(null);

const [isLoggedIn, setIsLoggedIn] =
  useState(false);



  const [deployments, setDeployments] =
    useState([]);

  const [logs, setLogs] =
    useState([]);

const [filter, setFilter] =
  useState("ALL");

  const [searchTerm, setSearchTerm] =
  useState("");

    const role =
    localStorage.getItem("role");

  // =========================
  // FETCH DEPLOYMENTS
  // =========================

  const fetchDeployments = async () => {

    try {

      const response =
        await API.get("/deployments");

      const sortedDeployments =
        response.data.deployments.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

      setDeployments(
        sortedDeployments
      );

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // START ROLLOUT
  // =========================

  const startRollout = async (id) => {

    try {

      // IMMEDIATE UI UPDATE
      setDeployments(
        (prevDeployments) =>
          prevDeployments.map(
            (deployment) =>

              deployment.deploymentId === id
                ? {

                    ...deployment,

                    status:
                      "ROLLING_OUT",

                    pipelineStatus:
                      "RUNNING",

                    currentStage:
                      "BUILDING",

                    trafficPercentage: 0,
                  }
                : deployment
          )
      );

      await API.post(
        `/deployments/${id}/start-rollout`
      );

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // ROLLBACK
  // =========================

  const rollbackDeployment = async (id) => {

    try {

      // IMMEDIATE UI UPDATE
      setDeployments(
        (prevDeployments) =>
          prevDeployments.map(
            (deployment) =>

              deployment.deploymentId === id
                ? {

                    ...deployment,

                    status:
                      "ROLLED_BACK",

                    pipelineStatus:
                      "ROLLED_BACK",

                    currentStage:
                      "ROLLBACK",

                    trafficPercentage: 0,
                  }
                : deployment
          )
      );

      await API.patch(
        `/deployments/${id}/rollback`
      );

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // DELETE
  // =========================

  const deleteDeployment = async (id) => {

    try {

      await API.delete(
        `/deployments/${id}`
      );

      fetchDeployments();

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // INITIAL FETCH
  // =========================

  useEffect(() => {

    fetchDeployments();

  }, []);

  // =========================
  // SOCKET EVENTS
  // =========================

  useEffect(() => {

    socket.on(
      "logEvent",
      (log) => {

        setLogs((prevLogs) => [
          log,
          ...prevLogs,
        ]);
      }
    );

    socket.on(
      "deploymentUpdated",
      (updatedDeployment) => {

        console.log(
          "SOCKET UPDATE:",
          updatedDeployment
        );

        setDeployments(
          (prevDeployments) => {

            const updatedList =
              prevDeployments.map(
                (deployment) => {

                  if (
                    deployment.deploymentId ===
                    updatedDeployment.deploymentId
                  ) {

                    return {

                      ...deployment,

                      trafficPercentage:
                        updatedDeployment.traffic ??
                        deployment.trafficPercentage,

                      status:
                        updatedDeployment.status ??
                        deployment.status,

                      pipelineStatus:
                        updatedDeployment.pipelineStatus ??
                        deployment.pipelineStatus,

                      currentStage:
                        updatedDeployment.currentStage ??
                        deployment.currentStage,

                      completedAt:
                        updatedDeployment.completedAt ??
                        deployment.completedAt,

                      duration:
                        updatedDeployment.duration ??
                        deployment.duration,
                    };
                  }

                  return deployment;
                }
              );

            return updatedList.sort(
              (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );
          }
        );
      }
    );

    return () => {

      socket.off(
        "deploymentUpdated"
      );

      socket.off(
        "logEvent"
      );
    };

  }, []);

  // =========================
  // DEBUG
  // =========================

  console.log(
    "DEPLOYMENTS:",
    deployments
  );

  // =========================
  // STATS
  // =========================

  const successfulDeployments =
    deployments.filter(
      (d) =>
        d.status === "COMPLETED"
    ).length;

  const rollbackDeployments =
    deployments.filter(
      (d) =>
        d.status === "ROLLED_BACK"
    ).length;

   const filteredDeployments =
  deployments.filter(
    (deployment) => {

      const matchesFilter =
        filter === "ALL"
          ? true
          : deployment.status === filter;

     const matchesSearch =
  searchTerm === ""
    ? true
    : deployment.version
        .toLowerCase()
        .trim() ===
      searchTerm
        .toLowerCase()
        .trim();

      return (
        matchesFilter &&
        matchesSearch
      );

    }
  );

  // =========================
  // UI
  // =========================
if (!selectedRole) {

  return (
    <RoleSelect
      onSelect={(role) =>
        setSelectedRole(role)
      }
    />
  );

}
if (!isLoggedIn) {

  return (
    <Login
      selectedRole={selectedRole}
      onLogin={() =>
        setIsLoggedIn(true)
      }
    />
  );

}
  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold mb-4">
            Deployment Control Plane
          </h1>

          <p className="text-slate-400 text-lg">
            Enterprise-grade serverless
            progressive delivery orchestration
            platform.
          </p>

        </div>

        {/* CREATE DEPLOYMENT */}

        {role === "ADMIN" && (
  <CreateDeploymentForm
    onDeploymentCreated={
      fetchDeployments
    }
  />
)}

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <StatsCard
            title="Total Deployments"
            value={deployments.length}
            color="text-blue-400"
          />

          <StatsCard
            title="Successful Rollouts"
            value={successfulDeployments}
            color="text-emerald-400"
          />

          <StatsCard
            title="Rollback Events"
            value={rollbackDeployments}
            color="text-red-400"
          />

        </div>

        {/* ANALYTICS */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">

          <div className="xl:col-span-2">

            <AnalyticsChart
              deployments={deployments}
            />

          </div>

          <ActivityFeed
            deployments={deployments}
          />

        </div>

        {/* INFRA */}

        <div className="mb-10">

          <InfrastructureMap />

        </div>

        {/* REGION MAP */}

        <div className="mb-10">

          <RegionMap
            deployments={deployments}
          />

        </div>

        {/* KUBERNETES */}

        <div className="mb-10">

         

        </div>

        {/* AI */}

        <div className="mb-10">

          <AIInsights
            deployments={deployments}
          />

        </div>

        {/* LOGS */}

        <div className="mb-10">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Live Deployment Logs
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">

              {logs.map(
                (log, index) => (

                  <div
                    key={index}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300"
                  >
                    {log}
                  </div>

                )
              )}

            </div>

          </div>

        </div>


   <div className="mb-8">

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

    {/* LEFT SIDE */}
    <div>

      <h2 className="text-3xl font-bold mb-3">
        Deployments
      </h2>

      <input
        type="text"
        placeholder="Search deployment version..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="
          w-full
          lg:w-96
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          px-4
          py-3
          text-white
          focus:outline-none
          focus:border-blue-500
        "
      />

    </div>

    {/* RIGHT SIDE */}
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 flex gap-1">

      <button
        onClick={() => setFilter("ALL")}
        className={`px-5 py-2 rounded-xl transition-all ${
          filter === "ALL"
            ? "bg-white text-slate-950 font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        All
      </button>

      <button
        onClick={() => setFilter("ROLLING_OUT")}
        className={`px-5 py-2 rounded-xl transition-all ${
          filter === "ROLLING_OUT"
            ? "bg-white text-slate-950 font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        Running
      </button>

      <button
        onClick={() => setFilter("COMPLETED")}
        className={`px-5 py-2 rounded-xl transition-all ${
          filter === "COMPLETED"
            ? "bg-white text-slate-950 font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        Completed
      </button>

      <button
        onClick={() => setFilter("ROLLED_BACK")}
        className={`px-5 py-2 rounded-xl transition-all ${
          filter === "ROLLED_BACK"
            ? "bg-white text-slate-950 font-semibold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        Rolled Back
      </button>

    </div>

  </div>

</div>

        {/* DEPLOYMENT CARDS */}

      

        {filteredDeployments.length > 0 ? (

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {filteredDeployments.map(
      (deployment) => (

        <DeploymentCard
          key={deployment.deploymentId}
          deployment={deployment}
          onStartRollout={startRollout}
          onRollback={rollbackDeployment}
          onDelete={deleteDeployment}
        />

      )
    )}

  </div>

) : (

  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">

    <h3 className="text-2xl font-bold mb-3">
      No Deployments Found
    </h3>

    <p className="text-slate-400">
      No deployment matches your search or filter.
    </p>

  </div>

)}

      </main>

    </div>
  );
}

export default App;