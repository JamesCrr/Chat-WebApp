const { fetchRoomsUserIsIn_Ids, fetchMessagesInRooms } = require("./fetchDbData");

const fetchMyRooms = async (req, res, next) => {
	const _userDbId = req.get("_userDbId");
	if (!_userDbId) return next("No User ID Found");
	// Get all associated rooms and send back
	const rooms = await fetchRoomsUserIsIn_Ids(_userDbId);
	res.json({ rooms });
};

const fetchRoomsMessages = async (req, res, next) => {
	const { rooms } = req.body;
	if (!rooms || rooms.length === 0) return next("No target rooms found");
	const messages = await fetchMessagesInRooms(rooms);
	res.json(messages);
};

module.exports = { fetchMyRooms, fetchRoomsMessages };
