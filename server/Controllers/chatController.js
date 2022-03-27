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

module.exports = { fetchMyRooms, fetchRoomsMessages };
