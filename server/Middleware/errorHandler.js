module.exports = (err, req, res, next) => {
	console.error("ErrorHandler:", err);
	res.status(404).json({ message: err });
};
