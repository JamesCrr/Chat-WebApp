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
