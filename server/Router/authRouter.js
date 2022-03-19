const { AttemptLogin, AttemptRegister } = require("../Controllers/authController");
const authRouter = require("express").Router();

authRouter.post("/login", AttemptLogin);
authRouter.post("/register", AttemptRegister);

module.exports = authRouter;
