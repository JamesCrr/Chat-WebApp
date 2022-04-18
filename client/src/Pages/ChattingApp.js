import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import useSocketIO from "../SocketIO/useSocketIO";
import { Box } from "@mui/material";
import ChatRoomLog from "./Chat/ChatRoomLog";
import RoomList from "./RoomList/RoomList";
import ChatOverlay from "./Chat/ChatOverlays/ChatOverlay";
import AppOverlay from "./ChattingAppOverlay";

export const OVERLAYTYPES = {
	NEWROOM: 0,
	ROOMDETAILS: 1,
};
Object.freeze(OVERLAYTYPES);

const Chat = ({ authUser }) => {
	const socketInstance = useSocketIO(authUser.getJWT(), socketSuccessCB, socketErrorCB);
	// Data Loading
	const [dataLoaded, setDataLoaded] = useState(false); // Initial data fully loaded yet?
	const dataLoadedBeforeRef = useRef(false); // Initial data been loaded before?
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
		socketInstance.registerListener("socketleftroom", ioListenerSocketLeftRoom);
		socketInstance.registerListener("updateroomowner", ioListenerUpdateRoomOwner);
		socketInstance.registerListener("othersocketjoinedleftroom", ioListenerOtherSocketJoinedLeftRoom);
		socketInstance.registerListener("refreshroomusersarray", ioListenerRefreshRoomUsersArray);
		//
		return () => {
			socketInstance.unregisterListener("receivemessage", ioListenerMessageReceived);
			socketInstance.unregisterListener("socketleftroom", ioListenerSocketLeftRoom);
			socketInstance.unregisterListener("updateroomowner", ioListenerUpdateRoomOwner);
			socketInstance.unregisterListener("othersocketjoinedleftroom", ioListenerOtherSocketJoinedLeftRoom);
			socketInstance.unregisterListener("refreshroomusersarray", ioListenerRefreshRoomUsersArray);
		};
	}, [ioListenerMessageReceived]);
	useEffect(() => {
		// Prevent multiple loading of data
		if (dataLoadedBeforeRef.current || socketInstance.isSocketLoading()) return;
		fetchInitialData();
		dataLoadedBeforeRef.current = true;
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
		const roomNames = roomResultJSON.rooms.map((roomObj) => {
			return roomObj.name;
		});
		// Register those rooms in SocketIO
		socketInstance.emitEvent("joinroom", { firstTimeJoined: false, roomNames, username: authUser.getUsername() });
		// Get messages in all Rooms
		result = await fetch("http://localhost:5000/chat/myroomsmessages", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				jwtAuth: authUser.getJWT(),
			},
			body: JSON.stringify({ rooms: roomNames }),
		});
		const messageResultJSON = await result.json();
		/**
		 * - No other work around avaliable, so have to send when first logging in.
		 * - When NEW user login for the very first time and need to let other users
		 * know about this in the room list, only update main room since, new user can only join that
		 **/
		socketInstance.emitEvent("toserver_refreshroomusersarray", { roomName: "main" });

		// Batch setStates
		ReactDOM.unstable_batchedUpdates(() => {
			setRoomObjArray(roomResultJSON.rooms);
			setSelectedRoomObj(roomResultJSON.rooms[0]);
			setChatLog(messageResultJSON);
			setDataLoaded(true);
		});
	};
	/**
	 * Checks for both SocketIO and MongoDB if still loading
	 * @returns True => data still loading, False => data is no longer loading	 */
	const isDataStillLoading = () => {
		if (socketInstance.isSocketLoading() || !dataLoaded) return true;
		return false;
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
	 * Attempt to create/join new Room at Server, if successful, update State and IOServer
	 * @param {String} newRoomToCreate Name of new room to create
	 */
	const createNewRoom = async (newRoomToCreate) => {
		console.log("RoomToCreate:", newRoomToCreate);
		let result;
		try {
			result = await fetch("http://localhost:5000/chat/createnewroom", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					jwtAuth: authUser.getJWT(),
				},
				body: JSON.stringify({ name: newRoomToCreate, firstUsername: authUser.getUsername(), firstUserDbId: authUser.getDBID() }),
			});
		} catch (error) {
			console.log(error);
			return;
		}
		const { created, joined, room } = await result.json();
		// Not joined, so definetely not created as well
		// Show error message
		if (!joined) {
			setOverlayDetails({ ...overlayDetails, errorMessage: "Room already joined!", error: true });
			return;
		}

		// Prepare for new room
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
		// Join room in Socket
		socketInstance.emitEvent("joinroom", { username: authUser.getUsername(), firstTimeJoined: joined, roomNames: [room.name] });
	};
	/**
	 * Attempt to delete existing Room at Server, if successful, update State and IOServer
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
		// [TODO]: Error handler, render smth to show room was not deleted
		// Was room removed?
		if (!resultJSON.room.deletedCount) return;

		// Delete Socket's room
		socketInstance.emitEvent("deleteroom", name);
		// Close Overlay
		disableOverlay();

		// Only Modify state once receive event from IO,
		// Should not be modifying state here
	};
	const leaveRoom = async (name) => {
		console.log("Leaving Room:", name);
		const result = await fetch("http://localhost:5000/chat/leaveroom", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				jwtAuth: authUser.getJWT(),
			},
			body: JSON.stringify({ name, usernameToRemove: authUser.getUsername() }),
		});
		const resultJSON = await result.json();
		// [TODO]: Error handler, render smth to show room was not left
		// Able to leave room?
		if (!resultJSON.room.name) return;

		// Leaving Socket's room
		socketInstance.emitEvent("leaveroom", { ownerUpdateObj: resultJSON.room.ownerUpdateObj, roomNames: name, username: authUser.getUsername() });
		ReactDOM.unstable_batchedUpdates(() => {
			// Close Overlay
			disableOverlay();
		});
	};

	/**
	 * Emitter function When socket submitting new message
	 * @param {String} content New message to send
	 */
	const ioEmitMessage = (content) =>
		socketInstance.emitEvent("chatmessage", { roomTarget: selectedRoomObj.name, content, sender: authUser.getUsername() });
	/**
	 * Listener function when receiving new message
	 * @param {Object} payload Message details
	 */
	function ioListenerMessageReceived(payload) {
		const { roomTarget } = payload;
		console.log("recevied mesage", payload);
		// Generate new array, push latest message obj in
		const tempChatLogArray = chatLog[roomTarget].slice();
		tempChatLogArray.push(payload);
		// Modify state
		const newChatState = { ...chatLog };
		newChatState[roomTarget] = tempChatLogArray;
		setChatLog(newChatState);
	}
	/**
	 * Listener function when this socket left a room
	 * @param {Object} payload
	 */
	function ioListenerSocketLeftRoom(payload) {
		const { leftRoomName } = payload;
		console.log("Removing Room from state:", leftRoomName);
		removeRoomFromState(leftRoomName);
		// currentRoom was deleted, return to default room
		if (selectedRoomObj.name === leftRoomName) {
			setSelectedRoomObj(roomObjArray[0]);
			disableOverlay();
		}
	}
	/**
	 * Listener function when OTHER socket Joined/Left a room
	 * @param {Object} payload
	 */
	function ioListenerOtherSocketJoinedLeftRoom(payload) {
		const { joined, roomName, username } = payload;
		console.log(username + (joined ? " joining " : " leaving ") + roomName);
		// Find the room to modify
		const newArray = [...roomObjArray];
		const roomIndex = newArray.findIndex((roomObj) => roomObj.name.toLowerCase() === roomName.toLowerCase());
		// User join room or leaving room
		if (joined) newArray[roomIndex].users.push(username);
		else {
			const userIndex = newArray[roomIndex].users.findIndex((arrayName) => arrayName.toLowerCase() === username);
			newArray[roomIndex].users.splice(userIndex, 1);
		}
		// Update state
		setRoomObjArray(newArray);
	}
	/**
	 * Listener function when a room owner changes
	 * @param {Object} payload
	 */
	function ioListenerUpdateRoomOwner(payload) {
		const { newOwnerusername, roomName } = payload;
		console.log("Room [" + roomName + "] got new Owner: " + newOwnerusername);
		const newArray = [...roomObjArray];
		const roomIndex = newArray.findIndex((roomObj) => roomObj.name.toLowerCase() === roomName.toLowerCase());
		// Change owner of room and Update State
		newArray[roomIndex].owner = newOwnerusername;
		setRoomObjArray(newArray);
	}
	/**
	 * Listener function to refresh room users array
	 * @param {Object} payload
	 */
	async function ioListenerRefreshRoomUsersArray(payload) {
		const { roomName } = payload;
		// Get data from MongoDB
		let result = await fetch("http://localhost:5000/chat/myrooms", {
			headers: {
				username: authUser.getUsername(),
				roomName: roomName,
				jwtAuth: authUser.getJWT(),
			},
		});
		const roomResultJSON = await result.json();
		const newUsersArray = roomResultJSON.rooms.users;
		console.log("Room [" + roomName + "] refreshing users array: " + newUsersArray);
		const newArray = [...roomObjArray];
		const roomIndex = newArray.findIndex((roomObj) => roomObj.name.toLowerCase() === roomName.toLowerCase());
		// Change owner of room and Update State
		newArray[roomIndex].users = newUsersArray;
		setRoomObjArray(newArray);
	}

	// Component Props
	let chatOverlayProps = {
		renderOverlay,
		overlayDetails,
		closeOverlayFunc: disableOverlay,
		createNewRoomFunc: createNewRoom,
		deleteRoomFunc: deleteRoom,
		leaveRoomFunc: leaveRoom,
		currentRoomObj: selectedRoomObj,
		handleLogout: authUser.handleLogout,
		isRoomOwner: selectedRoomObj.owner === authUser.getUsername(),
		roomOwnerName: selectedRoomObj.owner,
		ableToLeaveRoom: selectedRoomObj.name === "main" ? false : true,
	};
	return (
		<div>
			<AppOverlay logOutFunc={authUser.handleLogout} loading={isDataStillLoading()} error={socketInstance.isSocketError()} />
			{dataLoaded && (
				<Box>
					<ChatOverlay {...chatOverlayProps} />
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
		</div>
	);
};

export default Chat;