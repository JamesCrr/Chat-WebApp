const mongoose = require("mongoose");
const messageModel = require("../Models/messageModel");

module.exports = (ioServer) => {
	// Testing handling function
	const chatMessage = function (payload) {
		const socket = this;
		const { targetRoom, username, message } = payload;
		console.log(socket.id, "sent this:", message, "|| room:", targetRoom);
		ioServer.in(targetRoom).emit("receivemessage", { username, message });
	};
	const joinRoom = function (payload) {
		const socket = this;
		// Join rooms provided in payload
		for (let i = 0; i < payload.length; i++) {
			socket.join(payload[i]);
			console.log(socket.id, "Joining Room:", payload[i]);
		}
	};
	const leaveRoom = function (payload) {
		const socket = this;
		if (typeof payload === "string") payload = [payload];
		// Join rooms provided in payload
		for (let i = 0; i < payload.length; i++) {
			socket.leave(payload[i]);
			console.log(socket.id, "Leaving Room:", payload[i]);
		}
	};

	return { chatMessage, joinRoom, leaveRoom };
};
