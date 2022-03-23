const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		content: { type: String, required: true, minlength: 1 },
		roomTarget: { type: mongoose.ObjectId, required: true },
		sender: { type: mongoose.ObjectId, required: true },
	},
	{ timestamps: true }
);
const messageModel = mongoose.model("chatmessage", messageSchema);
module.exports = messageModel;
