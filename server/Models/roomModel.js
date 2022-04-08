const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true, minlength: 1 },
	deletable: { type: Boolean, default: true, required: true },
	owner: { type: String, required: true },
	users: { type: [String], required: true },
});
const roomModel = mongoose.model("room", roomSchema);
module.exports = roomModel;
