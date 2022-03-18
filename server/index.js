require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const httpServer = http.createServer(app);
const ioServer = require("socket.io")(httpServer, { cors: { origin: "*" } });
const { onConnection } = require("./socketIO/ioRequestListener");

// Express JSON Middleware
app.use(express.json());
// Serve basic response
app.get("/", (req, res) => {
	res.send("<h1>Server here</h1>");
});

// SocketIO Server Listener
ioServer.on("connection", onConnection);

// Start Http server
const portNum = process.env.HTTP_PORT || 7000;
httpServer.listen(portNum, () => {
	console.log("Server listening on port", portNum);
});
