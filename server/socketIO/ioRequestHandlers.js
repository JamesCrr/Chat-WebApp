const { addMessageToDb } = require("./ioToDbRequests");

module.exports = (ioServer) => {
	const chatMessage = function (payload) {
		const socket = this;
		const { roomTarget, sender, content } = payload;
		console.log(socket.id, "sent this:", content, "|| room:", roomTarget);
		ioServer.in(roomTarget).emit("receivemessage", { roomTarget, sender, content });
		// Send to DB
		//addMessageToDb(content, sender, roomTarget);
	};
	const joinRoom = function (payload) {
		const socket = this;
		const { rooms, newRoom } = payload;
		// Convert string to array
		if (typeof rooms === "string") rooms = [rooms];
		// Join rooms provided in payload
		for (let i = 0; i < rooms.length; i++) {
			socket.join(rooms[i]);
			console.log(socket.id, "Joining Room:", rooms[i]);
			// Emit joining message
			if (newRoom) ioServer.in(payload[i]).emit("receivemessage", { sender: null, content: `${socket.id} joined the Room!` });
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

	return { chatMessage, joinRoom, leaveRoom };
};
