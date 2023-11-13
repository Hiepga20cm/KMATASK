const socket = require("socket.io");
const requireSocketAuth = require("../middlewares/requireSocketAuth");
const callRequestHandler = require("../socketControllers/callRequestHandler");
const callResponseHandler = require("../socketControllers/callResponseHandler");
const directChatHistoryHandler = require("../socketControllers/directChatHistoryHandler");
const directMessageHandler = require("../socketControllers/directMessageHandler");
const disconnectHandler = require("../socketControllers/disconnectHandler");
const groupMessageHandler = require("../socketControllers/groupMessageHandler");
const newConnectionHandler = require("../socketControllers/newConnectionHandler");
const notifyChatLeft = require("../socketControllers/notifyChatLeft");
const notifyTypingHandler = require("../socketControllers/notifyTypingHandler");
const {
  setServerSocketInstance,
  getOnlineUsers,
  addNewConnectedAuth,
  removeConnectedUserAuth,
  setServerSocketInstanceAuth,
} = require("./connectedUsers");
const groupChatHistoryHandler = require("../socketControllers/groupChatHistoryHandler");
const roomJoinHandler = require("../socketControllers/room/roomJoinHandler");
const roomCreateHandler = require("../socketControllers/room/roomCreateHandler");
const roomLeaveHandler = require("../socketControllers/room/roomLeaveHandler");
const roomSignalingDataHandler = require("../socketControllers/room/roomSignalingDataHandler");
const roomInitializeConnectionHandler = require("../socketControllers/room/roomInitializeConnectionHandler");
const allowedSocketConnections = process.env.allowedSocketConnections
const createSocketServerAuth = (server) => {
  const ioAuth = socket(server, {
    cors: {
      origin: ["http://localhost:3000", `${allowedSocketConnections}`],
      methods: ["POST"],
    },
  });
  setServerSocketInstanceAuth(ioAuth);
  ioAuth.on("connection", (socket) => {
    console.log(`New socket auth connection connected: ${socket.id}`);
    addNewConnectedAuth({ socketId: socket.id });

    socket.on("disconnect", () => {
      console.log(`Connected auth socket disconnected: ${socket.id}`);
      removeConnectedUserAuth({ socketId: socket.id });
    });
    socket.on("sendDataLogin", (dataEncrypt, SocketId) => {
      const targetSocket = ioAuth.sockets.sockets.get(SocketId);
      if (targetSocket) {
        // Gửi dữ liệu đến socket có ID cụ thể
        console.log(dataEncrypt);
        targetSocket.emit("data-qr-login", dataEncrypt);
      }
    });
    socket.on("status-login-qr-frontend-to-server", (data) => {
      const targetSocket = ioAuth.sockets.sockets.get(data?.socketOrgId);
      if (targetSocket) {
        // Gửi dữ liệu đến socket có ID cụ thể
        targetSocket.emit("status-login-qr-server-to-mobile", data?.successfully);
      }
    })
  });
};

const createSocketServer = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:3000", `${allowedSocketConnections}`],
      methods: ["GET", "POST"],
    },
  });

  setServerSocketInstance(io);
  // check authentication of user
  io.use((socket, next) => {
    requireSocketAuth(socket, next);
  });

  io.on("connection", (socket) => {
    console.log(`New socket connection connected: ${socket.id}`);
    newConnectionHandler(socket, io);

    socket.on("direct-message", (data) => {
      directMessageHandler(socket, data);
    });

    socket.on("group-message", (data) => {
      groupMessageHandler(socket, data);
    });

    socket.on("direct-chat-history", (data) => {
      directChatHistoryHandler(socket, data.receiverUserId);
    });

    socket.on("group-chat-history", (data) => {
      groupChatHistoryHandler(socket, data.groupChatId);
    });

    socket.on("notify-typing", (data) => {
      notifyTypingHandler(socket, io, data);
    });

    socket.on("call-request", (data) => {
      callRequestHandler(socket, data);
    });

    socket.on("call-response", (data) => {
      callResponseHandler(socket, data);
    });

    socket.on("notify-chat-left", (data) => {
      notifyChatLeft(socket, data);
    });

    // rooms

    socket.on("room-create", () => {
      roomCreateHandler(socket);
    });

    socket.on("room-join", (data) => {
      roomJoinHandler(socket, data);
    });

    socket.on("room-leave", (data) => {
      roomLeaveHandler(socket, data);
    });

    socket.on("conn-init", (data) => {
      roomInitializeConnectionHandler(socket, data);
    });

    socket.on("conn-signal", (data) => {
      roomSignalingDataHandler(socket, data);
    });

    socket.on("disconnect", () => {
      console.log(`Connected socket disconnected: ${socket.id}`);
      disconnectHandler(socket, io);
    });
  });

  // emit online users to all connected users every 10 seconds
  // setInterval(() => {
  //     io.emit("online-users", getOnlineUsers());
  // }, 10 * 1000)
};

module.exports = {
  createSocketServer,
  createSocketServerAuth,
};
