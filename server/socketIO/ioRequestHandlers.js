const messageModel = require("../Models/messageModel");

const addMessageToDb = async (content, sender, roomTarget) => {
	const messageDocument = await messageModel.create({ content, sender, roomTarget });
};

module.exports = (ioServer) => {
	const chatMessage = function (payload) {
		const socket = this;
		const { roomTarget, sender, content } = payload;
		//console.log(socket.id, "sent this:", content, "|| room:", roomTarget);
		/**
		 * [updatedDateString] calculated independently when received event.
		 * [updatedDateString] will not be synced with DB as did not wait for DB to
		 * return the entry bfr emitting event. [updatedDateString] will be different when
		 * fetching from DB even though same message object
		 */
		const updatedDateString = new Date().toJSON();
		// Emit all room users
		ioServer.in(roomTarget).emit("receivemessage", { createdDateString: updatedDateString, updatedDateString, roomTarget, sender, content });
		// Send to DB
		addMessageToDb(content, sender, roomTarget);
	};
	const joinRoom = function (payload) {
		const socket = this;
		let { username, roomNames, firstTimeJoined } = payload;
		// Convert string to array
		if (typeof roomNames === "string") roomNames = [roomNames];
		// Join roomNames provided in payload
		for (let i = 0; i < roomNames.length; i++) {
			socket.join(roomNames[i]);
			//console.log(socket.id, "Joining Room:", roomNames[i]);
			// Emit joining message to members
			if (firstTimeJoined) {
				//console.log("first time join!");
				// Wait a little before emitting message
				setTimeout(() => {
					// Emit all room users, Welcome message
					ioServer.in(roomNames[i]).emit("receiveservermessage", {
						roomTarget: roomNames[i],
						sender: "SERVER",
						content: `${username} joined the Room!`,
					});
				}, 100);
				// Emit to other room users
				socket.to(roomNames[i]).emit("othersocketjoinedleftroom", { joined: true, roomName: roomNames[i], username });
			}
		}
	};
	const leaveRoom = function (payload) {
		const socket = this;
		let { username, roomNames, ownerUpdateObj } = payload;
		// Convert string to array
		if (typeof roomNames === "string") roomNames = [roomNames];
		// Leave rooms provided in roomNames
		for (let i = 0; i < roomNames.length; i++) {
			//console.log(socket.id, "Leaving Room:", roomNames[i]);
			// Leave room
			socket.leave(roomNames[i]);
			// Emit all room users, leaving message of socket in Room
			ioServer.in(roomNames[i]).emit("receiveservermessage", {
				roomTarget: roomNames[i],
				sender: "SERVER",
				content: `${username} left the Room!`,
			});
			// Emit other room users
			socket.to(roomNames[i]).emit("othersocketjoinedleftroom", { joined: false, roomName: roomNames[i], username });
			// Emit all room users, update owner of room
			if (ownerUpdateObj.modified) ioServer.in(roomNames[i]).emit("updateroomowner", { ...ownerUpdateObj, roomName: roomNames[i] });
			// Emit individual socket that left
			socket.emit("socketleftroom", { leftRoomName: roomNames[i] });
		}
	};
	const deleteRoom = function (payload) {
		// Emit all room users, final event
		ioServer.in(payload).emit("socketleftroom", { leftRoomName: payload });
		// Make all sockets leave room
		ioServer.socketsLeave(payload);
	};
	const refreshRoomUsersArray = function (payload) {
		const socket = this;
		const { roomName } = payload;
		// Emit to other room users to refresh the room user array
		socket.to(roomName).emit("refreshroomusersarray", payload);
	};

	const mapOfUsers = new Map();
	const getArrayOfConnectedUsers = function () {
		const connectedUsers = [];
		mapOfUsers.forEach((value) => {
			connectedUsers.push(value);
		});
		return connectedUsers;
	};
	const userConnected = function (payload) {
		const socket = this;
		const { username } = payload;
		// console.log("NEW USER CONNECTED:", username);
		mapOfUsers.set(socket.id, username);
		ioServer.emit("receiveconnectedusers", { arrayOfUsers: getArrayOfConnectedUsers() });
	};
	const userDisconnected = function (socketId) {
		// console.log("NEW USER DISCONNECTED:", mapOfUsers.get(socketId));
		mapOfUsers.delete(socketId);
		ioServer.emit("receiveconnectedusers", { arrayOfUsers: getArrayOfConnectedUsers() });
	};

	const socketDisconnecting = function () {
		const socket = this;
		//console.log(socket.id, "about to leave");
		// Remove from map of connected users
		userDisconnected(socket.id);
	};

	return { userConnected, socketDisconnecting, chatMessage, joinRoom, leaveRoom, deleteRoom, refreshRoomUsersArray };
};
