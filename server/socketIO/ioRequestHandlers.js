const messageModel = require("../Models/messageModel");

const addMessageToDb = async (content, sender, roomTarget) => {
	const messageDocument = await messageModel.create({ content, sender, roomTarget });
};

module.exports = (ioServer) => {
	const chatMessage = function (payload) {
		const socket = this;
		const { roomTarget, sender, content } = payload;
		console.log(socket.id, "sent this:", content, "|| room:", roomTarget);
		/**
		 * [updatedDateString] calculated independently when received event.
		 * [updatedDateString] will not be synced with DB as did not wait for DB to
		 * return the entry bfr emitting event. [updatedDateString] will be different when
		 * fetching from DB even though same message object
		 */
		const updatedDateString = new Date().toJSON();
		// Emit event
		ioServer.in(roomTarget).emit("receivemessage", { updatedDateString, roomTarget, sender, content });
		// Send to DB
		// addMessageToDb(content, sender, roomTarget);
	};
	const joinRoom = function (payload) {
		const socket = this;
		let { username, roomNames, firstTimeJoined } = payload;
		// Convert string to array
		if (typeof roomNames === "string") roomNames = [roomNames];
		// Join roomNames provided in payload
		for (let i = 0; i < roomNames.length; i++) {
			socket.join(roomNames[i]);
			console.log(socket.id, "Joining Room:", roomNames[i]);
			// Emit joining message to members
			if (firstTimeJoined) {
				console.log("first time join!");
				const updatedDateString = new Date().toJSON();
				// Wait a little before emitting message
				setTimeout(() => {
					ioServer
						.in(roomNames[i])
						.emit("receivemessage", { updatedDateString, roomTarget: roomNames[i], sender: "SERVER", content: `${username} joined the Room!` });
				}, 100);
			}
		}
	};
	const leaveRoom = function (payload) {
		const socket = this;
		let { username, roomNames } = payload;
		// Convert string to array
		if (typeof roomNames === "string") roomNames = [roomNames];
		// Leave rooms provided in roomNames
		for (let i = 0; i < roomNames.length; i++) {
			console.log(socket.id, "Leaving Room:", roomNames[i]);
			// Leave room
			socket.leave(roomNames[i]);
			// Emit leaving message for other sockets in Room
			ioServer.in(roomNames[i]).emit("receivemessage", {
				updatedDateString: new Date().toJSON(),
				roomTarget: roomNames[i],
				sender: "SERVER",
				content: `${username} left the Room!`,
			});
			// Emit left room to individual socket
			socket.emit("socketleftroom", { leftRoomName: roomNames[i] });
		}
	};
	const deleteRoom = function (payload) {
		// Emit final event
		ioServer.in(payload).emit("socketleftroom", { leftRoomName: payload });
		// Make all sockets leave room
		ioServer.socketsLeave(payload);
	};

	return { chatMessage, joinRoom, leaveRoom, deleteRoom };
};
