const mongoose = require("mongoose");
const roomModel = require("../Models/roomModel");
const { fetchRoomsUserIsIn_Names, fetchMessagesInRooms } = require("./fetchDbData");

const fetchMyRooms = async (req, res, next) => {
	const username = req.get("username");
	if (!username) return next("No Username Found");
	// Get all associated rooms and send back
	const rooms = await fetchRoomsUserIsIn_Names(username);
	res.json({ rooms });
};

const fetchRoomsMessages = async (req, res, next) => {
	const { rooms } = req.body;
	if (!rooms || rooms.length === 0) return next("No target rooms found");
	const messages = await fetchMessagesInRooms(rooms);
	res.json(messages);
};

const createNewRoom = async (req, res, next) => {
	const { name, firstUsername } = req.body;
	if (!name || !firstUsername) return next("Unable to create room. Invalid room details");
	let created = false; // Was room created or fetched
	let joined = false; // Did user join the room
	let roomDocument = await roomModel.findOne({ name });
	// Need to join room?
	if (roomDocument) roomDocument.users.find((element) => element === firstUsername) ? (joined = false) : (joined = true);
	// Create and join new room
	else {
		created = joined = true;
		//roomDocument = await roomModel.create({ name, users: [firstUsername], owner: new mongoose.Types.ObjectId() });
	}
	res.json({ created, joined, room: roomDocument });
};

module.exports = { fetchMyRooms, fetchRoomsMessages, createNewRoom };
