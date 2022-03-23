const { fetchUserInRooms_Ids } = require("./fetchDbData");

const fetchMyRooms = async (req, res, next) => {
	const _dbId = req.get("_dbId");
	if (!_dbId) return next("No User ID Found");
	// Get all associated rooms and send back
	const rooms = await fetchUserInRooms_Ids(_dbId);
	res.json({ rooms });
};

module.exports = { fetchMyRooms };
