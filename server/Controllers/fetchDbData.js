const mongoose = require("mongoose");
const roomModel = require("../Models/roomModel");
const messageModel = require("../Models/messageModel");
const userModel = require("../Models/userModel");

/**
 * Fetch all rooms in databsae
 * @returns Map of rooms
 */
const fetchRooms = async () => {
	const resultRooms = await roomModel.find({}).lean();
	// console.log("RoomsFound:", resultRooms.length);
	const mapOfRooms = new Map();
	if (resultRooms.length === 0) {
		// No default room, create one
		const resultUsers = await fetchUsers();
		const users = [];
		resultUsers.map((element) => users.push(element.username));
		const defaultRoom = { name: "main", owner: new mongoose.Types.ObjectId(), users };
		// Update DB and map
		await roomModel.create(defaultRoom, function (err, room) {
			defaultRoom._dbId = room._id;
			mapOfRooms.set("main", defaultRoom); // map
		});
	} else {
		// Return all existing rooms
		for (let i = 0; i < resultRooms.length; i++) {
			let { name, owner, users, _id } = resultRooms[i];
			mapOfRooms.set(name, { name, owner, users, _dbId: _id });
		}
	}
	return mapOfRooms;
};

/**
 * Fetch all users in DB
 * @returns Array of Users
 */
const fetchUsers = async () => {
	return await userModel.find({}).lean();
};

/**
 * Fetch rooms that the user is part of
 * @param {String} username Name of user to test
 * @returns Array of Room Objects that user is in
 */
const fetchRoomsUserIsIn_Names = async (username) => {
	const mapOfRooms = await fetchRooms();
	const arrayOfUserRooms = [];
	mapOfRooms.forEach((room, key) => {
		if (room.users.find((element) => element.toString() === username)) arrayOfUserRooms.push(room);
	});
	return arrayOfUserRooms;
};

/**
 * Fetch all messages of rooms
 * @param {Array} roomName Array of Names of selected rooms
 * @returns Object that contains all messages of selected rooms
 */
const fetchMessagesInRooms = async (roomNames) => {
	const resultMessages = await messageModel.find({ roomTarget: { $in: roomNames } }).lean();
	const roomMessages = {};
	roomNames.map((element) => {
		roomMessages[element] = [];
	});
	resultMessages.map((messageObj) => {
		roomMessages[messageObj.roomTarget].push({ _dbId: messageObj._id, content: messageObj.content, sender: messageObj.sender });
	});
	return roomMessages;
};

module.exports = { fetchRooms, fetchRoomsUserIsIn_Names, fetchMessagesInRooms };
