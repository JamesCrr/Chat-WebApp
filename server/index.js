require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const app = express();
const httpServer = http.createServer(app);
// Express
const authRouter = require("./Router/authRouter");
const chatRouter = require("./Router/chatRouter");
const { notFoundMiddlware, errorHandlerMiddleware } = require("./Middleware");
// Socket IO
const ioServer = require("socket.io")(httpServer, { cors: { origin: "*" } });
const { chatMessage, joinRoom, leaveRoom, deleteRoom, refreshRoomUsersArray } = require("./SocketIO/ioRequestHandlers")(ioServer);
const { authMiddleware } = require("./SocketIO/ioMiddleware");

// Express Middleware
app.use(cors());
app.use(express.json());
// Router
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.get("/", (req, res) => {
	res.send("<h1>Server here</h1>");
});
app.use(notFoundMiddlware);
app.use(errorHandlerMiddleware);

// SocketIO middleware
ioServer.use(authMiddleware);
// SocketIO Server Listener
ioServer.on("connection", (socket) => {
	console.log(socket.id, "connected to server");

	// Login => register socket to all user's rooms, send whatever else needed

	// Join Room => register user to room
	// Leave Room => unregister user from room
	// Delete Room => delete room from server
	socket.on("joinroom", joinRoom);
	socket.on("leaveroom", leaveRoom);
	socket.on("deleteroom", deleteRoom);
	// Refresh Room Users Array => refresh existing users's room users array
	socket.on("toserver_refreshroomusersarray", refreshRoomUsersArray);
	// Chat Message => send message to target room
	socket.on("chatmessage", chatMessage);

	socket.on("disconnecting", () => console.log(socket.id, "about to leave"));
	socket.on("disconnect", () => console.log("socket left"));
});

// Start Server
const portNum = process.env.HTTP_PORT || 7000;
const startServer = async () => {
	// Connect to MongoDB first
	await mongoose.connect(process.env.MONGOURL);
	console.log("MongoDB connected");
	// Start Http server
	httpServer.listen(portNum, () => console.log("Server listening on port", portNum));
};
startServer();
