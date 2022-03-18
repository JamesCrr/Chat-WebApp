module.exports = (ioServer) => {
	// Testing handling function
	const testFunc = function (payload) {
		const socket = this;
		const { message } = payload;
		console.log(socket.id, "sent this:", message);
	};

	return { testFunc };
};
