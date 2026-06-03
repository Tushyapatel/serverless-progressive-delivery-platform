import { useState } from "react";
import API from "../api/api";

function CreateDeploymentForm({ onDeploymentCreated }) {
  const [version, setVersion] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     await API.post("/deployments", {
  version,
});

      setVersion("");
      setFailAt("");

      onDeploymentCreated();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-3xl mb-10 border border-slate-800">
      <h2 className="text-2xl font-bold mb-6">
        Create Deployment
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="Version (e.g. v7)"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
          required
        />

      
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateDeploymentForm;