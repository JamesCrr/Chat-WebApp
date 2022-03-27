const messageModel = require("../Models/messageModel");

const addMessageToDb = async (content, sender, roomTarget) => {
	const messageDocument = await messageModel.create({ content, sender, roomTarget });
};

module.exports = { addMessageToDb };
