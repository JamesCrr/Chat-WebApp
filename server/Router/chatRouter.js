const authCheck = require("../Middleware/authCheck");
const { fetchMyRooms, fetchRoomsMessages, createNewRoom } = require("../Controllers/chatController");
const chatRouter = require("express").Router();

chatRouter.use(authCheck);
chatRouter.get("/myrooms", fetchMyRooms);
chatRouter.post("/myroomsmessages", fetchRoomsMessages);
chatRouter.post("/createnewroom", createNewRoom);

module.exports = chatRouter;
