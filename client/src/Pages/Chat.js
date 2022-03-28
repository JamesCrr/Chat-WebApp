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
		socketInstance.registerListener("roomisdeleted", ioListenerDeletedRoom);
		return () => {
			socketInstance.unregisterListener("receivemessage", ioListenerMessageReceived);
			socketInstance.unregisterListener("roomisdeleted", ioListenerDeletedRoom);
		};
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
		socketInstance.emitEvent("joinroom", { firstTimeJoined: false, roomName: roomResultJSON.rooms });
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
	 * @param {Object} newCurrentRoom New current room
	 */
	const onChangeCurrentRoom = (newCurrentRoom) => setCurrentRoom(newCurrentRoom);

	/**
	 * Removes a room from roomArray State, if found that is
	 * @param {String} roomToRemove Name of room to remove
	 */
	const removeRoomFromState = (roomToRemove) => {
		const newArray = [...roomArray];
		const removeIndex = newArray.findIndex((element) => element.toLowerCase() === roomToRemove.toLowerCase());
		if (removeIndex < 0) return false;
		newArray.splice(removeIndex, 1);
		setRoomArray(newArray);
		return true;
	};

	/**
	 *
	 * @param {String} newRoomToCreate Name of new room to create
	 */
	const onCreateNewRoom = async (newRoomToCreate) => {
		console.log("RoomToCreate:", newRoomToCreate);
		let result = await fetch("http://localhost:5000/chat/createnewroom", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				jwtAuth: authUser.getJWT(),
			},
			body: JSON.stringify({ name: newRoomToCreate, firstUsername: authUser.getUsername() }),
		});
		const { created, joined, room } = await result.json();
		// [TODO]:
		// Not created, maybe can display smth here to show that?
		// ....

		// Join room in Socket, Add room to state
		if (!joined) return;
		socketInstance.emitEvent("joinroom", { firstTimeJoined: joined, roomName: [room.name] });
		// Set new room state
		setRoomArray([...roomArray, room.name]);
		const newChatState = { ...chatLog };
		let newChatLog = [];
		// Fetch existing messages from server or empty array
		if (!created) {
			// Fetch existing messages
			result = await fetch("http://localhost:5000/chat/myroomsmessages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					jwtAuth: authUser.getJWT(),
				},
				body: JSON.stringify({ rooms: room.name }),
			});
			const messageResultJSON = await result.json();
			newChatLog = messageResultJSON[room.name];
		}
		// Set new Chat state
		newChatState[room.name] = newChatLog;
		setChatLog(newChatState);
	};
	/**
	 *
	 * @param {String} name Name of room to delete
	 */
	const onDeleteRoom = async (name) => {
		const result = await fetch("http://localhost:5000/chat/deleteroom", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				jwtAuth: authUser.getJWT(),
			},
			body: JSON.stringify({ name }),
		});
		const resultJSON = await result.json();
		// Was room removed?
		if (!resultJSON.room.deletedCount) return;
		// Leave Socket's room
		socketInstance.emitEvent("deleteroom", name);
		// Only Modify state once receive event, not done here
	};

	/**
	 * When user submitting new message
	 * @param {String} content New message to send
	 */
	const ioEmitMessage = (content) => socketInstance.emitEvent("chatmessage", { roomTarget: currentRoom, content, sender: authUser.getUsername() });
	/**
	 * Listener function when receiving new message
	 * @param {Object} payload Message details
	 */
	function ioListenerMessageReceived(payload) {
		const { roomTarget, sender, content } = payload;
		console.log("recevied mesage", payload);
		// Generate new array, push latest message in
		const tempChatLogArray = chatLog[roomTarget].slice();
		tempChatLogArray.push({ sender, content });
		// Modify state
		const newChatState = { ...chatLog };
		newChatState[roomTarget] = tempChatLogArray;
		setChatLog(newChatState);
	}
	/**
	 * Listener function when room was deleted by someone else
	 * @param {Object} payload
	 */
	function ioListenerDeletedRoom(payload) {
		const { name } = payload;
		console.log("DeletingRoom:", name);
		removeRoomFromState(name);
		// if currentRoom was deletedRoom
		// go back to default room
		setCurrentRoom(roomArray[0]);
	}

	/******** Temp ********/
	const toggleError = () => {
		setSocketError(!socketError);
	};
	/*********************************/

	return (
		<div>
			{socketLoading ? (
				<h1>Socket Loading</h1>
			) : (
				<ChatContainer>
					<RoomList
						roomArray={roomArray}
						currentRoom={currentRoom}
						currentRoomChangedFunc={onChangeCurrentRoom}
						createNewRoomFunc={onCreateNewRoom}
					/>
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
