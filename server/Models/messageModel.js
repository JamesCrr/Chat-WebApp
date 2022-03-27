const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		content: { type: String, required: true, minlength: 1 },
		roomTarget: { type: String, required: true },
		sender: { type: String, required: true },
	},
	{ timestamps: true }
);
const messageModel = mongoose.model("chatmessage", messageSchema);
module.exports = messageModel;
