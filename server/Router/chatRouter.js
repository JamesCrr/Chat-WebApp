const authCheck = require("../Middleware/authCheck");
const { fetchMyRooms, fetchRoomsMessages, createNewRoom, deleteRoom, leaveRoom } = require("../Controllers/chatController");
const chatRouter = require("express").Router();

chatRouter.use(authCheck);
chatRouter.get("/myrooms", fetchMyRooms);
chatRouter.post("/myroomsmessages", fetchRoomsMessages);
chatRouter.post("/createnewroom", createNewRoom);
chatRouter.post("/deleteroom", deleteRoom);
chatRouter.post("/leaveroom", leaveRoom);

module.exports = chatRouter;
