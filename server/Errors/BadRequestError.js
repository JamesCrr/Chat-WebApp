const BaseErrorClass = require("./BaseErrorClass");

class BadRequestError extends BaseErrorClass {
	constructor(msg) {
		super(400, msg);
	}
}

module.exports = BadRequestError;
