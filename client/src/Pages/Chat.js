import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import useSocketIO from "../SocketIO/useSocketIO";
import { Box } from "@mui/material";
import ChatRoomLog from "./ChatRoomLog";
import RoomList from "./RoomList";
import ChatOverlay from "./ChatOverlays/ChatOverlay";

export const OVERLAYTYPES = {
	NEWROOM: 0,
	ROOMDETAILS: 1,
};
Object.freeze(OVERLAYTYPES);

const Chat = ({ authUser }) => {
	const socketInstance = useSocketIO(authUser.getJWT(), socketSuccessCB, socketErrorCB);
	const dataLoadedRef = useRef(false); // Has Initial data been loaded yet?
	// Overlay
	const [renderOverlay, setRenderOverlay] = useState(false);
	const [overlayDetails, setOverlayDetails] = useState({ newRoom: false, roomDetails: false, error: false, errorMessage: "" });
	// Rooms
	const [roomObjArray, setRoomObjArray] = useState([]);
	const [selectedRoomObj, setSelectedRoomObj] = useState({ name: "" });
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
		if (dataLoadedRef.current || socketInstance.isSocketLoading()) return;
		fetchInitialData();
		dataLoadedRef.current = true;
	}, [socketInstance.isSocketLoading]);

	/**
	 * Socket Callbacks
	 */
	// Hoisted function
	function socketErrorCB() {
		console.log("Socket Error Callback");
	}
	function socketSuccessCB() {
		console.log("Socket Success Callback");
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
		const roomName = roomResultJSON.rooms.map((roomObj) => {
			return roomObj.name;
		});
		socketInstance.emitEvent("joinroom", { firstTimeJoined: false, roomName });
		// Get messages in all Rooms
		result = await fetch("http://localhost:5000/chat/myroomsmessages", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				jwtAuth: authUser.getJWT(),
			},
			body: JSON.stringify({ rooms: roomName }),
		});
		const messageResultJSON = await result.json();

		// Batch setStates
		ReactDOM.unstable_batchedUpdates(() => {
			setRoomObjArray(roomResultJSON.rooms);
			setSelectedRoomObj(roomResultJSON.rooms[0]);
			setChatLog(messageResultJSON);
		});
	};

	/**
	 * Helper function remove a room from roomObjArray State, if found,
	 * @param {String} roomToRemove Name of room to remove
	 */
	const removeRoomFromState = (roomToRemove) => {
		const newArray = [...roomObjArray];
		const removeIndex = newArray.findIndex((roomObj) => roomObj.name.toLowerCase() === roomToRemove.toLowerCase());
		if (removeIndex < 0) return false;
		newArray.splice(removeIndex, 1);
		setRoomObjArray(newArray);
		return true;
	};
	/**
	 * When the selected Room changes
	 * @param {Object} newSelectedRoom New selected room
	 */
	const newSelectedRoom = (newSelectedRoom) => setSelectedRoomObj(newSelectedRoom);

	/**
	 * Opens the Overlay for Adding of New Room
	 * @param {Number} overlayType
	 */
	const enableNewRoomOverlay = (overlayType) => {
		const newOverlayDetail = { newRoom: false, roomDetails: false, error: false, errorMessage: "" };
		switch (overlayType) {
			case OVERLAYTYPES.NEWROOM:
				newOverlayDetail.newRoom = true;
				break;
			case OVERLAYTYPES.ROOMDETAILS:
				newOverlayDetail.roomDetails = true;
				break;
		}
		// Render new Overlay
		setRenderOverlay(true);
		setOverlayDetails(newOverlayDetail);
	};
	/**
	 * Closes the Overlay
	 */
	const disableOverlay = () => {
		setRenderOverlay(false);
		setOverlayDetails({ ...overlayDetails, error: false, errorMessage: "" });
	};

	/**
	 * Attempt to create new Room at Server, if successful, update State
	 * @param {String} newRoomToCreate Name of new room to create
	 */
	const createNewRoom = async (newRoomToCreate) => {
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
		// Not joined, so definetely not created as well
		// Show error message
		if (!joined) {
			setOverlayDetails({ ...overlayDetails, errorMessage: "Room already joined!", error: true });
			return;
		}

		// Join room in Socket
		socketInstance.emitEvent("joinroom", { firstTimeJoined: joined, roomName: [room.name] });
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
		// New Chat State
		newChatState[room.name] = newChatLog;

		// Batch setStates
		ReactDOM.unstable_batchedUpdates(() => {
			// Close Overlay
			disableOverlay();
			// Add room to state
			setRoomObjArray([...roomObjArray, room]);
			setChatLog(newChatState);
		});
	};
	/**
	 * Attempt to delete existing Room at Server, if successful, update State
	 * @param {String} name Name of room to delete
	 */
	const deleteRoom = async (name) => {
		const result = await fetch("http://localhost:5000/chat/deleteroom", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				jwtAuth: authUser.getJWT(),
			},
			body: JSON.stringify({ name }),
		});
		const resultJSON = await result.json();
		// [TODO]: Error handler, render smth show room was not deleted
		// Was room removed?
		if (!resultJSON.room.deletedCount) return;
		// Leave Socket's room
		socketInstance.emitEvent("deleteroom", name);

		// Only Modify state once receive event from IO,
		// Should not modify state here..
	};
	const leaveRoom = async (name) => {
		console.log("Leaving Room:", name);
	};

	/**
	 * Emitter function When user submitting new message
	 * @param {String} content New message to send
	 */
	const ioEmitMessage = (content) =>
		socketInstance.emitEvent("chatmessage", { roomTarget: selectedRoomObj.name, content, sender: authUser.getUsername() });
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
		// currentRoom was deleted, return to default room
		if (selectedRoomObj.name === name) setSelectedRoomObj(roomObjArray[0]);
	}

	return (
		<div>
			{socketInstance.isSocketLoading() ? (
				<h1>Socket Loading</h1>
			) : (
				<Box>
					<ChatOverlay
						renderOverlay={renderOverlay}
						overlayDetails={overlayDetails}
						closeOverlayFunc={disableOverlay}
						createNewRoomFunc={createNewRoom}
						handleLogout={authUser.handleLogout}
					/>
					<Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
						<RoomList
							roomArray={roomObjArray}
							selectedRoomName={selectedRoomObj.name}
							selectedRoomChangedFunc={newSelectedRoom}
							openNewRoomOverlay={enableNewRoomOverlay}
						/>
						<ChatRoomLog
							chatLog={chatLog[selectedRoomObj.name] ? chatLog[selectedRoomObj.name] : []}
							selectedRoomObj={selectedRoomObj}
							openRoomDetailsFunc={enableNewRoomOverlay}
							submitFieldValueFunc={ioEmitMessage}
						/>
					</Box>
				</Box>
			)}
			{/* THIS IS TEMPORARY, FIND A BETTER WAY THAN THIS, or 
				maybe this is alreayd the best way?? */}
			{/* [TO SOLVE]: 
			New messages will not have a dbID yet, so will cause errors... */}

			{/* {authUser.isUserLoggedIn() && (
				<Button onClick={authUser.handleLogout} variant="outlined">
					Log out
				</Button>
			)} */}
		</div>
	);
};

export default Chat;
