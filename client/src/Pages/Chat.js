import React, { useEffect, useRef, useState } from "react";
import useSocketIO from "../SocketIO/useSocketIO";
import { styled, Button, Box } from "@mui/material";
import ChatLog from "./ChatLog";
import RoomList from "./RoomList";

const ChatContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-around",
	alignItems: "center",
}));

const Chat = ({ authUser }) => {
	const socketInstance = useSocketIO(authUser.getJWT(), socketConnectionError, socketConnectionSuccess);
	const [socketError, setSocketError] = useState(false); // Socket has any errors?
	const [socketLoading, setSocketLoading] = useState(true); // Socket still loading?
	const dataLoadedRef = useRef(false);
	// Rooms
	const [roomArray, setRoomArray] = useState([]);
	const [currentRoom, setCurrentRoom] = useState(null);
	// ChatLog
	const [chatLog, setChatLog] = useState({});

	useEffect(() => {
		// Reregister listener functions to prevent stale state
		socketInstance.registerListener("receivemessage", ioListenerMessageReceived);
		return () => socketInstance.unregisterListener("receivemessage", ioListenerMessageReceived);
	}, [ioListenerMessageReceived]);
	useEffect(() => {
		// Prevent multiple loading of data
		if (dataLoadedRef.current || socketLoading) return;
		fetchInitialData();
		dataLoadedRef.current = true;
	}, [socketLoading]);

	/**
	 * Socket Connection Error callback
	 */
	// Hoisted function
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
	 * Fetches required initial data
	 */
	const fetchInitialData = async () => {
		// Get all rooms the user is in
		let result = await fetch("http://localhost:5000/chat/myrooms", {
			headers: {
				username: authUser.getUsername(),
				jwtAuth: authUser.getJWT(),
			},
		});
		const roomResultJSON = await result.json();
		// Inform SocketIO
		socketInstance.emitEvent("joinrooms", roomResultJSON.rooms);
		// Get messages in all Rooms
		result = await fetch("http://localhost:5000/chat/myroomsmessages", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				jwtAuth: authUser.getJWT(),
			},
			body: JSON.stringify({ rooms: roomResultJSON.rooms }),
		});
		const messageResultJSON = await result.json();
		// Set State
		setRoomArray(roomResultJSON.rooms);
		setCurrentRoom(roomResultJSON.rooms[0]);
		setChatLog(messageResultJSON);
	};

	/**
	 * When the current Room changes
	 * @param {Object} newRoom New current room
	 */
	const onChangeCurrentRoom = (newRoom) => {
		setCurrentRoom(newRoom);
	};
	/**
	 * When user submitting new message
	 * @param {String} content New message to send
	 */
	const ioEmitMessage = (content) => socketInstance.emitEvent("chatmessage", { roomTarget: currentRoom, content, sender: authUser.getUsername() });

	/**
	 * Listener function when receiving new message
	 * @param {Object} payload Message Details
	 */
	function ioListenerMessageReceived(payload) {
		const { roomTarget, sender, content } = payload;
		console.log("recevied mesage", payload);
		// Generate new array, push latest message in
		const tempChatLog = chatLog[roomTarget].slice();
		tempChatLog.push({ sender, content });
		// Modify state
		const newState = { ...chatLog };
		newState[roomTarget] = tempChatLog;
		setChatLog(newState);
	}

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
					<RoomList roomArray={roomArray} currentRoom={currentRoom} currentRoomChangedFunc={onChangeCurrentRoom} />
					<ChatLog chatLog={chatLog[currentRoom] ? chatLog[currentRoom] : []} submitFieldValueFunc={ioEmitMessage} />
				</ChatContainer>
			)}

			{authUser.isUserLoggedIn() && (
				<Button onClick={authUser.handleLogout} variant="outlined">
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
