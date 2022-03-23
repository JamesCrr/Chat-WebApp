const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		minlength: 1,
		maxlength: 20,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});
userSchema.methods.matchingPassword = async function (plainTextPassword) {
	return await bcrypt.compare(plainTextPassword, this.password);
};
userSchema.methods.generateJWT = async function () {
	return await jwt.sign({ username: this.username, id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};

userSchema.pre("save", async function (next) {
	const hashedPassword = await bcrypt.hash(this.password, 5);
	this.password = hashedPassword;
	next();
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
