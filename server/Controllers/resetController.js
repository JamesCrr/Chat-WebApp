const messageModel = require("../Models/messageModel");
const roomModel = require("../Models/roomModel");
const userModel = require("../Models/userModel");

const resetAllData = async (req, res, next) => {
	const users = ["user1", "John", "Kevin"];
	const rooms = ["main", "secondRoom"];
	let timer = 0;
	const step = 100;
	/**
	 * Have to create one by one because of the timing and order of the data
	 * Mongoose will NOT follow array index if create using an array..
	 */
	// Reset Rooms
	setTimeout(async () => await roomModel.deleteMany({}), (timer += step));
	setTimeout(async () => await roomModel.create({ name: rooms[0], owner: "SERVER", users, deletable: false }), (timer += step));
	setTimeout(async () => await roomModel.create({ name: rooms[1], owner: users[0], users: [users[0]], deletable: true }), (timer += step));
	// Reset Messages
	// createdAt property is Immutable, only updatedAt can be changed...
	setTimeout(async () => await messageModel.deleteMany({}), (timer += step));
	setTimeout(async () => await messageModel.create({ content: "Hello there", sender: users[1], roomTarget: rooms[0] }), (timer += step));
	setTimeout(async () => await messageModel.create({ content: "How are you doing?", sender: users[1], roomTarget: rooms[0] }), (timer += step));
	setTimeout(async () => await messageModel.create({ content: "It's pretty sunny here", sender: users[1], roomTarget: rooms[0] }), (timer += step));
	setTimeout(async () => await messageModel.create({ content: "user1 here", sender: users[0], roomTarget: rooms[0] }), (timer += step));
	setTimeout(async () => await messageModel.create({ content: "kevin is here", sender: users[2], roomTarget: rooms[0] }), (timer += step));
	setTimeout(async () => await messageModel.create({ content: "testing", sender: users[0], roomTarget: rooms[1] }), (timer += step));
	// Reset Users
	setTimeout(async () => await userModel.deleteMany({}), (timer += step));
	setTimeout(async () => await userModel.create({ username: "user1", email: "q", password: "q" }), (timer += step));
	setTimeout(async () => await userModel.create({ username: "John", email: "qwe", password: "123qwe" }), (timer += step));
	setTimeout(async () => await userModel.create({ username: "Kevin", email: "e", password: "e" }), (timer += step));

	res.json({ message: `reset started, finish in ${timer}ms`, timer });
};

module.exports = { resetAllData };
