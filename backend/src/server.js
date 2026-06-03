const express = require("express");
const cors = require("cors");
const http = require("http");

const authRoutes =
  require("./routes/authRoutes");
const deploymentRoutes =
  require("./routes/deploymentRoutes");

const {
  initializeLogging,
} = require("./services/loggingService");

const app = express();

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.set("io", io);

/* CORS FIRST */
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/deployments",
  deploymentRoutes
);

initializeLogging();

const PORT = 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});