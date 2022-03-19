const userModel = require("../Models/userModel");

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
	res.json({ message: "Logged In", username: result.username, token });
};
const AttemptRegister = async (req, res, next) => {
	const { username, email, password } = req.body;
	try {
		if (!username || !email || !password) throw new Error(`Invalid registerData ${username}, ${email} or ${password}!`);
		// username or email already exists?
		// convert the username toLowerCase for easier checking
		let result = await userModel.findOne({ $or: [{ username: { $regex: new RegExp(`^${username}$`, "i") } }, { email }] });
		if (result) throw new Error("Username or email already taken");
		// Register new user into DB
		//const userDocument = await userModel.create({ username, email, password });
	} catch (error) {
		return next(error.message);
	}
	res.json({ message: "registered" });
};

module.exports = { AttemptLogin, AttemptRegister };
