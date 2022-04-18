module.exports = (errObject, req, res, next) => {
	console.error("ErrorHandler:", errObject);
	res.status(errObject.errorCode).json(errObject);
};
