const jwt = require("jsonwebtoken");

const authMiddleware = (socket, next) => {
	const token = socket.handshake.auth.token || null;
	// [TODO]:
	// Return own error so can display to user properly

	// If not authorised, reject connection to server
	if (!token || !jwt.verify(token, process.env.JWT_SECRET)) next(new Error("Not Authorised to access!"));
	// console.log("socket:", socket.id, "\nwith token: ", token);
	next();
};

module.exports = { authMiddleware };
