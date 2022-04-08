const mongoose = require("mongoose");
const messageModel = require("../Models/messageModel");
const roomModel = require("../Models/roomModel");
const userModel = require("../Models/userModel");
const { fetchRoomsUserIsIn_Names, fetchMessagesInRooms } = require("./DBHelperFunctions");

const fetchMyRooms = async (req, res, next) => {
	const username = req.get("username");
	if (!username) return next("No Username Found");
	// Get all associated rooms and send back
	const rooms = await fetchRoomsUserIsIn_Names(username);
	const filteredRooms = rooms.map((room) => {
		return { owner: room.owner, name: room.name, users: room.users };
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
	const { name, firstUsername, firstUserDbId } = req.body;
	if (!name || !firstUsername || !firstUserDbId) return next("Unable to create/join room. Invalid room details");
	let created = false; // Was room created or fetched
	let joined = true; // Did user join the room
	let roomDocument = await roomModel.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
	// Room already exists
	if (roomDocument) {
		// Is there anybody in room
		if (roomDocument.users.length > 0)
			roomDocument.users.find((element) => element.toLowerCase() === firstUsername.toLowerCase()) ? (joined = false) : (joined = true);
		else {
			// Set New Owner as no users in created room
			roomDocument.owner = firstUsername;
			// roomDocument.owner = new mongoose.Types.ObjectId(firstUserDbId);
			joined = true;
		}

		if (joined) {
			// Update users array
			roomDocument.users = [...roomDocument.users, firstUsername];
			await roomDocument.save();
		}
	} else {
		// Create new room
		created = true;
		roomDocument = await roomModel.create({ name, users: [firstUsername], owner: firstUsername });
	}
	res.json({ created, joined, room: { owner: roomDocument.owner, name: roomDocument.name, users: roomDocument.users } });
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

	// Find last user in room, make that user the owner
	let ownerUpdateObj = { modified: false, newOwnerusername: "" };
	if (updatedRoomResult.users.length === 1) {
		const userDoc = await userModel.findOne({ username: updatedRoomResult.users[0] }).lean();
		updatedRoomResult.owner = userDoc.username;
		await updatedRoomResult.save();
		// Take note of new owner, send back with result
		ownerUpdateObj = { modified: true, newOwnerusername: userDoc.username };
	}

	// Send updated result
	res.json({ room: { ownerUpdateObj, name: updatedRoomResult.name, usersLeft: updatedRoomResult.users } });
};

module.exports = { fetchMyRooms, fetchRoomsMessages, createNewRoom, deleteRoom, leaveRoom };
