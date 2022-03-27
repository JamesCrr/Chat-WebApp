const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const myJwt = req.get("jwtAuth");
	if (!myJwt) res.status(404).json({ message: "Not Authenticated!" });
	try {
		const decoded = jwt.verify(myJwt, process.env.JWT_SECRET);
	} catch (error) {
		res.status(404).json({ message: "Not Authenticated" });
	}
	next();
};
