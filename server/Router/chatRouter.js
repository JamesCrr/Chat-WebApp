const authCheck = require("../Middleware/authCheck");
const { fetchMyRooms, fetchRoomsMessages } = require("../Controllers/chatController");
const chatRouter = require("express").Router();

chatRouter.use(authCheck);
chatRouter.get("/myrooms", fetchMyRooms);
chatRouter.post("/myroomsmessages", fetchRoomsMessages);

module.exports = chatRouter;
