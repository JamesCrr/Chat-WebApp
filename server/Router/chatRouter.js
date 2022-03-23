const { fetchMyRooms } = require("../Controllers/chatController");
const chatRouter = require("express").Router();

chatRouter.get("/myrooms", fetchMyRooms);

module.exports = chatRouter;
