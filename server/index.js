require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const app = express();
const httpServer = http.createServer(app);
// Express
const authRouter = require("./Router/authRouter");
const { notFoundMiddlware, errorHandlerMiddleware } = require("./Middleware");
// Socket IO
const ioServer = require("socket.io")(httpServer, { cors: { origin: "*" } });
const { onConnection } = require("./SocketIO/ioRequestListener");

// Express Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.get("/", (req, res) => {
	res.send("<h1>Server here</h1>");
});
app.use(notFoundMiddlware);
app.use(errorHandlerMiddleware);

// SocketIO Server Listener
ioServer.on("connection", onConnection);

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
