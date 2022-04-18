const { NotAuthenticatedError } = require("../Errors");
const jwt = require("jsonwebtoken");

const authMiddleware = (socket, next) => {
	const token = socket.handshake.auth.token || null;
	// If not authorised, reject connection to server
	if (!token || !jwt.verify(token, process.env.JWT_SECRET)) next(new NotAuthenticatedError("Not Authorised to access!"));
	// console.log("socket:", socket.id, "\nwith token: ", token);
	next();
};

module.exports = { authMiddleware };
