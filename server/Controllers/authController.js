const userModel = require("../Models/userModel");
const roomModel = require("../Models/roomModel");

const AttemptLogin = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) return next("Invalid email or password!");
	// Does User exist
	const result = await userModel.findOne({ email });
	if (!result) return next("No user Found");
	const matchingPassword = await result.matchingPassword(password);
	if (!matchingPassword) return next("Wrong Password");
	// Generate JWT and send back
	const token = await result.generateJWT();
	res.json({ message: "Logged In", username: result.username, _dbId: result._id, token });
};
const AttemptRegister = async (req, res, next) => {
	const { username, email, password } = req.body;
	try {
		if (!username || !email || !password) throw new Error(`Invalid registerData ${username}, ${email} or ${password}!`);
		// username or email already exists?
		// convert the username toLowerCase for easier checking
		let result = await userModel.findOne({ $or: [{ username: { $regex: new RegExp(`^${username}$`, "i") } }, { email }] });
		if (result) throw new Error("Username or email already taken");
		// // Register new user into DB
		// // [TODO]: Uncomment this before deploying!
		// const userDocument = await userModel.create({ username, email, password });

		// // Add new user to main room
		// result = await roomModel.findOne({ deletable: false });
		// result.users.push(username);
		// await result.save(); // Save to MongoDB
	} catch (error) {
		return next(error.message);
	}
	res.json({ message: "registered" });
};

module.exports = { AttemptLogin, AttemptRegister };
