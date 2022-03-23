const mongoose = require("mongoose");
const roomModel = require("../Models/roomModel");
const messageModel = require("../Models/messageModel");
const userModel = require("../Models/userModel");

const fetchRooms = async () => {
	const resultRooms = await roomModel.find({}).lean();
	// console.log("RoomsFound:", resultRooms.length);
	const mapOfRooms = new Map();
	if (resultRooms.length === 0) {
		// No default room, create one
		// Update DB and map
		const resultUsers = await fetchUsers_Ids();
		const defaultRoom = { name: "main", owner: new mongoose.Types.ObjectId(), users: resultUsers };
		// update DB and map
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
 * Fetch all users in DB and returns their ObjectIDs
 * @returns Array of ObjectIDs of Users
 */
const fetchUsers_Ids = async () => {
	const resultUsers = await userModel.find({});
	return resultUsers.map((element, index) => {
		return element._id;
	});
};

/**
 *
 * @param {String} userDbId DB Id of user to test
 * @returns Array of Room's ObjectIds that user is in
 */
const fetchUserInRooms_Ids = async (userDbId) => {
	const mapOfRooms = await fetchRooms();
	const arrayOfUserRooms = [];
	mapOfRooms.forEach((room, key) => {
		if (room.users.find((element) => element.toString() === userDbId)) arrayOfUserRooms.push(room._dbId);
	});
	return arrayOfUserRooms;
};

module.exports = { fetchRooms, fetchUserInRooms_Ids };
