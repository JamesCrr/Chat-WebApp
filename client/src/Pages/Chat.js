import React, { useRef, useState } from "react";
import useSocketIO from "../SocketIO/useSocketIO";
import { styled, Button, Box } from "@mui/material";
import ChatLog from "./ChatLog";
import RoomList from "./RoomList";

const ChatContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-around",
	alignItems: "center",
}));

const Chat = ({ auth }) => {
	const socketInstance = useSocketIO(auth.getJWT(), socketConnectionError, socketConnectionSuccess);
	const [socketError, setSocketError] = useState(false); // Socket has any errors?
	const [socketLoading, setSocketLoading] = useState(true); // Socket still loading?
	// Currently selected Room
	const [currentRoom, setCurrentRoom] = useState(null);

	// Hoisted function
	/**
	 * Socket Connection Error callback
	 */
	function socketConnectionError() {
		console.log("Socket Connection Error Callback!");
		setSocketError(true);
		setSocketLoading(false);
	}
	function socketConnectionSuccess() {
		console.log("Socket Connection Success Callback!");
		setSocketLoading(false);
	}

	/**
	 * When the current Room changes
	 * @param {Object} newRoom New current room
	 */
	const onChangeCurrentRoom = (newRoom) => setCurrentRoom(newRoom);
	/**
	 * Rooms for socket to join
	 * @param {Object} rooms Rooms for socket to join
	 */
	const emitJoinRooms = (rooms) => socketInstance.emitEvent("joinrooms", rooms);
	/**
	 * When user submitting new message
	 * @param {String} message New message to send
	 */
	const emitMessage = (message) => socketInstance.emitEvent("chatmessage", { targetRoom: currentRoom, message, username: auth.getUsername() });

	/******** Temp ********/
	const toggleError = () => {
		setSocketError(!socketError);
		socketInstance.printSocketRef();
	};

	/*********************************/

	return (
		<div>
			{socketLoading ? (
				<h1>Socket Loading</h1>
			) : (
				<ChatContainer>
					<RoomList DBID={auth.getDBID()} joinRoomsFunc={emitJoinRooms} currentRoom={currentRoom} currentRoomChangedFunc={onChangeCurrentRoom} />
					<ChatLog
						registerListener={socketInstance.registerListener}
						unregisterListener={socketInstance.unregisterListener}
						submitFieldValueFunc={emitMessage}
						currentRoom={currentRoom}
					/>
				</ChatContainer>
			)}

			{auth.isUserLoggedIn() && (
				<Button onClick={auth.handleLogout} variant="outlined">
					Log out
				</Button>
			)}
			<form>
				<Button onClick={toggleError} variant="outlined">
					SWICH STATETE
				</Button>
			</form>
		</div>
	);
};

export default Chat;
