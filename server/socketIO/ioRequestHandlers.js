const { addMessageToDb } = require("./ioToDbRequests");

module.exports = (ioServer) => {
	const chatMessage = function (payload) {
		const socket = this;
		const { roomTarget, sender, content } = payload;
		console.log(socket.id, "sent this:", content, "|| room:", roomTarget);
		ioServer.in(roomTarget).emit("receivemessage", { roomTarget, sender, content });
		// Send to DB
		// addMessageToDb(content, sender, roomTarget);
	};
	const joinRoom = function (payload) {
		const socket = this;
		const { roomName, firstTimeJoined } = payload;
		// Convert string to array
		if (typeof roomName === "string") roomName = [roomName];
		// Join roomName provided in payload
		for (let i = 0; i < roomName.length; i++) {
			socket.join(roomName[i]);
			console.log(socket.id, "Joining Room:", roomName[i]);
			// Emit joining message to members
			if (firstTimeJoined) ioServer.in(payload[i]).emit("receivemessage", { sender: null, content: `${socket.id} joined the Room!` });
		}
	};
	const leaveRoom = function (payload) {
		const socket = this;
		// Convert string to array
		if (typeof payload === "string") payload = [payload];
		// Join rooms provided in payload
		for (let i = 0; i < payload.length; i++) {
			socket.leave(payload[i]);
			console.log(socket.id, "Leaving Room:", payload[i]);
			// Emit leaving message
			ioServer.in(payload[i]).emit("receivemessage", { sender: null, content: `${socket.id} left the Room!` });
		}
	};
	const deleteRoom = function (payload) {
		// Emit final event
		ioServer.in(payload).emit("roomisdeleted", { name: payload });
		// Make all sockets leave room
		ioServer.socketsLeave(payload);
	};

	return { chatMessage, joinRoom, leaveRoom, deleteRoom };
};
