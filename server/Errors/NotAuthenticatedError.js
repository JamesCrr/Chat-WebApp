const BaseErrorClass = require("./BaseErrorClass");

class NotAuthenticatedError extends BaseErrorClass {
	constructor(msg) {
		super(401, msg);
	}
}

module.exports = NotAuthenticatedError;
