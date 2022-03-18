// this = element that SET the Listener, which is IOServer
const { testFunc } = require("./ioRequestHandlers")(this);

const onConnection = (socket) => {
	console.log(socket.id, "connected to server");

	socket.on("test", testFunc);
	socket.on("disconnecting", () => console.log(socket.id, "about to leave"));
	socket.on("disconnect", () => console.log("client left"));
};

module.exports = { onConnection };
