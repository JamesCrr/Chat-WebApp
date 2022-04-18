const jwt = require("jsonwebtoken");
const { NotAuthenticatedError } = require("../Errors");

module.exports = (req, res, next) => {
	const myJwt = req.get("jwtAuth");
	if (!myJwt) return next(new NotAuthenticatedError("Not Authenticated!"));
	try {
		const decoded = jwt.verify(myJwt, process.env.JWT_SECRET);
	} catch (error) {
		return next(new NotAuthenticatedError("Not Authenticated!"));
	}
	next();
};
