const express = require("express");
const cors = require("cors");
require("dotenv").config();
const deploymentRoutes = require("./routes/deploymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/deployments", deploymentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Serverless Progressive Delivery Platform API",
    status: "running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});