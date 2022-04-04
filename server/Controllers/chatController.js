const mongoose = require("mongoose");
const messageModel = require("../Models/messageModel");
const roomModel = require("../Models/roomModel");
const { fetchRoomsUserIsIn_Names, fetchMessagesInRooms } = require("./fetchDbData");

const fetchMyRooms = async (req, res, next) => {
	const username = req.get("username");
	if (!username) return next("No Username Found");
	// Get all associated rooms and send back
	const rooms = await fetchRoomsUserIsIn_Names(username);
	const filteredRooms = rooms.map((room) => {
		return { name: room.name, users: room.users };
	});
	res.json({ rooms: filteredRooms });
};

const fetchRoomsMessages = async (req, res, next) => {
	let { rooms } = req.body;
	if (!rooms || rooms.length === 0) return next("No target rooms found");
	if (typeof rooms === "string") rooms = [rooms];
	const messages = await fetchMessagesInRooms(rooms);
	res.json(messages);
};

const createNewRoom = async (req, res, next) => {
	const { name, firstUsername } = req.body;
	if (!name || !firstUsername) return next("Unable to create room. Invalid room details");
	let created = false; // Was room created or fetched
	let joined = true; // Did user join the room
	let roomDocument = await roomModel.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
	// Room already exists
	if (roomDocument) {
		roomDocument.users.find((element) => element.toLowerCase() === firstUsername.toLowerCase()) ? (joined = false) : (joined = true);
		// Update DB if joinning room
		if (joined) {
			roomDocument.users = [...roomDocument.users, firstUsername];
			await roomDocument.save();
		}
	} else {
		// Create new room
		created = true;
		roomDocument = await roomModel.create({ name, users: [firstUsername], owner: new mongoose.Types.ObjectId() });
	}
	res.json({ created, joined, room: { name: roomDocument.name, users: roomDocument.users } });
};

const deleteRoom = async (req, res, next) => {
	const { name } = req.body;
	if (!name) return next("Unable to delete room, Invalid room details");
	// Delete room
	const roomDeleteResult = await roomModel.deleteOne({ name: { $regex: new RegExp(`^${name}$`, "i") }, deletable: true });
	if (roomDeleteResult.deletedCount < 1) return next("No Room deleted, check again!");
	// Also delete messages of deleted room
	const messageDeleteResult = await messageModel.deleteMany({ roomTarget: { $regex: new RegExp(`^${name}$`, "i") } });
	res.json({ room: roomDeleteResult, messages: messageDeleteResult });
};

const leaveRoom = async (req, res, next) => {
	const { name, usernameToRemove } = req.body;
	if (!name || !usernameToRemove) return next("Unable to leave room, Invalid room details");
	// Does room exist
	const roomFoundResult = await roomModel.findOne({ name }).lean();
	if (!roomFoundResult) return next("Room not found, Invalid room details");
	// Is user in room to begin with
	const roomUsers = roomFoundResult.users;
	if (roomUsers.findIndex((user) => user === usernameToRemove) === -1) return next("User not in room to begin with, Unable to remove");
	// Remove user from room, update DB
	const newUserArray = roomUsers.filter((user) => user !== usernameToRemove);
	const updatedRoomResult = await roomModel.findOneAndUpdate({ name }, { users: newUserArray }, { new: true });
	// Send updated result
	res.json({ room: { name: updatedRoomResult.name, users: updatedRoomResult.users } });
};

module.exports = { fetchMyRooms, fetchRoomsMessages, createNewRoom, deleteRoom, leaveRoom };
