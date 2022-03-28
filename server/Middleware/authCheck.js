const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const myJwt = req.get("jwtAuth");
	if (!myJwt) return next("Not Authenticated!");
	try {
		const decoded = jwt.verify(myJwt, process.env.JWT_SECRET);
	} catch (error) {
		return next("Not Authenticated!");
	}
	next();
};
