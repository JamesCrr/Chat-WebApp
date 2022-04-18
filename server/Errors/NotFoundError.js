const BaseErrorClass = require("./BaseErrorClass");

class NotFoundError extends BaseErrorClass {
	constructor(msg) {
		super(404, msg);
	}
}

module.exports = NotFoundError;
