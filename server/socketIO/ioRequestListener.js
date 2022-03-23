// this = element that SET the Listener, which is IOServer

const onConnection = (socket) => {
	const { chatMessage, joinRoom } = require("./ioRequestHandlers")(this);
	const { fetchRooms } = require("../Controllers/fetchDbData");

	// const roomMap = fetchRooms();
	// setTimeout(() => console.log("ROOMMAP:", roomMap), 1500);
	console.log(socket.id, "connected to server");

	// Login => register socket to all user's rooms, send whatever else needed
	socket.on("joinroom", joinRoom);
	// Join Room => register user to room
	// Leave Room => unregister user from room

	// message => send message to target room
	socket.on("chatmessage", chatMessage);
	socket.on("disconnecting", () => console.log(socket.id, "about to leave"));
	socket.on("disconnect", () => console.log("socket left"));
};

module.exports = { onConnection };
