require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");
const groupChatRoutes = require("./routes/groupChatRoutes");
const configRoutes = require("./routes/getConfigEnv")
const {
  createSocketServer,
  createSocketServerAuth,
} = require("./socket/socketServer");

const PORT = process.env.PORT || 5000;
const PORTSOCKET = process.env.PORTSOCKET || 5001
const app = express();
app.use(express.json());
app.use(cors());

// register the routes
app.use("/api/auth", authRoutes);
app.use("/api/invite-friend", friendInvitationRoutes);
app.use("/api/group-chat", groupChatRoutes);
app.use("/api/config",configRoutes);

const appAuth = express();
appAuth.use(express.json());
appAuth.use(cors());

// register the routes
appAuth.use("/api/auth", authRoutes);

const serverAuth = http.createServer(appAuth);
const server = http.createServer(app);


// socket connection
createSocketServer(server);
createSocketServerAuth(serverAuth);

const MONGO_URI =
  process.env.NODE_ENV === "dev"
    ? process.env.MONGO_URI
    : process.env.MONGO_URI_DEV;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`SERVER STARTED ON ${PORT}.....!`);
    });
    serverAuth.listen(PORTSOCKET, "0.0.0.0", () => {
      console.log(`SERVER STARTED ON ${PORTSOCKET}.....!`);
    });
  })
  .catch((err) => {
    console.log("database connection failed. Server not started");
    console.error(err);
  });
