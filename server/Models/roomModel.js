const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true, minlength: 1 },
	// owner currently has no use, maybe in future if want to implement room ownership, can use
	owner: { type: mongoose.ObjectId, required: true },
	users: { type: [String], required: true },
});
const roomModel = mongoose.model("room", roomSchema);
module.exports = roomModel;
