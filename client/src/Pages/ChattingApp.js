import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import useSocketIO from "../SocketIO/useSocketIO";
import { Box } from "@mui/material";
import ChatRoomLog from "./Chat/ChatLog";
import RoomList from "./RoomList/RoomList";
import ChatOverlay from "./Chat/ChatOverlays/ChatOverlay";
import LoadingAndErrorOverlay from "./Chat/ChatOverlays/ChatOverlayLoadingAndError";
import NotificationChip from "./Chat/ChatOverlays/NotificationChip";

export const OVERLAYTYPES = {
	NEWROOM: 0,
	ROOMDETAILS: 1,
};
Object.freeze(OVERLAYTYPES);

const Chat = ({ authUser }) => {
	const socketInstance = useSocketIO(authUser.getJWT(), socketSuccessCB, socketDisconnectCB, socketErrorCB);
	// Data Loading
	const [dataLoaded, setDataLoaded] = useState(false); // Initial data fully loaded yet?
	const dataLoadedBeforeRef = useRef(false); // Initial data been loaded before?
	// Overlay
	const [renderOverlay, setRenderOverlay] = useState(false);
	const [overlayDetails, setOverlayDetails] = useState({
		newRoom: false,
		roomDetails: false,
		error: false,
		errorMessage: "",
		waitingForServer: true,
	});
	const [notificationChipDetails, setNotificationClipDetails] = useState({ active: false, message: "" });
	// Connected Users
	const [connectedUsers, setConnectedUsers] = useState(new Map());
	// Rooms
	const [roomObjMap, setRoomObjMap] = useState(new Map());
	const [selectedRoomObj, setSelectedRoomObj] = useState({ name: "" });
	const [unreadMessagesMap, setUnreadMessagesMap] = useState(new Map());
	// ChatLog
	const [chatLog, setChatLog] = useState({});

	// Run every time rerenders
	useEffect(() => {
		// Reregister listener functions to prevent stale state
		socketInstance.registerListener("receivemessage", ioListenerMessageReceived);
		socketInstance.registerListener("receiveservermessage", ioListenerSERVERMessageReceived);
		socketInstance.registerListener("receiveconnectedusers", ioListenerConnectedUsersReceived);
		socketInstance.registerListener("socketleftroom", ioListenerSocketLeftRoom);
		socketInstance.registerListener("updateroomowner", ioListenerUpdateRoomOwner);
		socketInstance.registerListener("othersocketjoinedleftroom", ioListenerOtherSocketJoinedLeftRoom);
		socketInstance.registerListener("refreshroomusersarray", ioListenerRefreshRoomUsersArray);
		return () => {
			socketInstance.unregisterListener("receivemessage", ioListenerMessageReceived);
			socketInstance.unregisterListener("receiveservermessage", ioListenerSERVERMessageReceived);
			socketInstance.unregisterListener("receiveconnectedusers", ioListenerConnectedUsersReceived);
			socketInstance.unregisterListener("socketleftroom", ioListenerSocketLeftRoom);
			socketInstance.unregisterListener("updateroomowner", ioListenerUpdateRoomOwner);
			socketInstance.unregisterListener("othersocketjoinedleftroom", ioListenerOtherSocketJoinedLeftRoom);
			socketInstance.unregisterListener("refreshroomusersarray", ioListenerRefreshRoomUsersArray);
		};
	});
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
		socketInstance.emitEvent("userconnected", { username: authUser.getUsername() });
	}
	function socketDisconnectCB() {
		console.log("Socket Disconnect Callback");
	}
	/**
	 * Fetches required initial data
	 */
	const fetchInitialData = async () => {
		// Get all rooms the user is in
		let result = await fetch(process.env.REACT_APP_SERVERURL + "/chat/myrooms", {
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
		result = await fetch(process.env.REACT_APP_SERVERURL + "/chat/myroomsmessages", {
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
			const newMap = new Map();
			for (let i = 0; i < roomResultJSON.rooms.length; i++) {
				newMap.set(roomResultJSON.rooms[i].name, roomResultJSON.rooms[i]);
			}
			setRoomObjMap(newMap);
			setSelectedRoomObj(newMap.values().next().value);
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
	 * Helper function remove a room from roomObjMap State, if found,
	 * @param {String} roomToRemove Name of room to remove
	 * @returns True => room was removed, False => remove did not occur
	 */
	const removeRoomFromState = (roomToRemove) => {
		const newMap = new Map(roomObjMap);
		const result = newMap.delete(roomToRemove);
		setRoomObjMap(newMap);
		return result;
	};
	/**
	 * Helper function to remove value from unreadMessagesMap
	 * @param {String} roomNameToRemove Name of unread message's room to remove
	 */
	const removeUnreadMessageCountFromState = (roomNameToRemove) => {
		const newMap = new Map(unreadMessagesMap);
		newMap.delete(roomNameToRemove);
		setUnreadMessagesMap(newMap);
	};
	/**
	 * Helper function to add a new message into ChatLog State
	 * @param {Object} messageObject Message Object
	 */
	const addMessageToState = (messageObject) => {
		// Generate new array, push latest message obj in
		const roomName = messageObject.roomTarget;
		const tempChatLogArray = chatLog[roomName].slice();
		tempChatLogArray.push(messageObject);
		const newChatState = { ...chatLog };
		newChatState[roomName] = tempChatLogArray;
		setChatLog(newChatState);
		// Message belongs to other room?
		if (roomName !== selectedRoomObj.name) {
			const newMap = new Map(unreadMessagesMap);
			let unreadCount = newMap.has(roomName) ? newMap.get(roomName) + 1 : 1;
			newMap.set(roomName, unreadCount);
			setUnreadMessagesMap(newMap);
		}
	};
	/**
	 * When the selected Room changes
	 * @param {Object} newSelectedRoom New selected room
	 */
	const newSelectedRoom = (newSelectedRoom) => {
		setSelectedRoomObj(newSelectedRoom);
		// Remove unread messages of new selected room
		removeUnreadMessageCountFromState(newSelectedRoom.name);
	};

	/**
	 * Opens the Overlay for Adding of New Room
	 * @param {Number} overlayType
	 */
	const enableNewRoomOverlay = (overlayType) => {
		const newOverlayDetail = { newRoom: false, roomDetails: false, error: false, errorMessage: "", waitingForServer: false };
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
		setOverlayDetails({ ...overlayDetails, error: false, errorMessage: "", waitingForServer: false });
	};
	/**
	 * Closes the Notification Chip
	 */
	const closeNotificationChip = () => setNotificationClipDetails({ ...notificationChipDetails, active: false });

	/**
	 * Attempt to create/join new Room at Server, if successful, update State and IOServer
	 * @param {String} newRoomToCreate Name of new room to create
	 */
	const createNewRoom = async (newRoomToCreate) => {
		//console.log("RoomToCreate:", newRoomToCreate);
		setOverlayDetails({ ...overlayDetails, waitingForServer: true });
		let result;
		try {
			result = await fetch(process.env.REACT_APP_SERVERURL + "/chat/createnewroom", {
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
			setOverlayDetails({ ...overlayDetails, error: true, errorMessage: "Room already joined!", waitingForServer: false });
			return;
		}

		// Prepare for new room
		const newChatState = { ...chatLog };
		let newChatLog = [];
		// Fetch existing messages from server or empty array
		if (!created) {
			// Fetch existing messages
			result = await fetch(process.env.REACT_APP_SERVERURL + "/chat/myroomsmessages", {
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
		// Update state immediately as no IO server callback required
		ReactDOM.unstable_batchedUpdates(() => {
			// Close Overlay
			disableOverlay();
			// Add room to state
			const newMap = new Map(roomObjMap);
			newMap.set(room.name, room);
			setRoomObjMap(newMap);
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
		setOverlayDetails({ ...overlayDetails, waitingForServer: true });
		const result = await fetch(process.env.REACT_APP_SERVERURL + "/chat/deleteroom", {
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

		// Only Modify state once receive event callback from IO,
		// Should not be modifying state here
	};
	const leaveRoom = async (name) => {
		//console.log("Leaving Room:", name);
		setOverlayDetails({ ...overlayDetails, waitingForServer: true });
		const result = await fetch(process.env.REACT_APP_SERVERURL + "/chat/leaveroom", {
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

		// Only Modify state once receive event callback from IO
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
		//console.log("recevied message", payload);
		addMessageToState(payload);
	}
	/**
	 * Listener function when receiving new SERVER message
	 * @param {Object} payload Message details
	 */
	function ioListenerSERVERMessageReceived(payload) {
		//console.log("received SERVER message", payload);
		// Set the message date, as the timing from the server
		// might be different
		const currentDateString = new Date().toJSON();
		const newPayload = { ...payload, createdDateString: currentDateString, updatedDateString: currentDateString };
		addMessageToState(newPayload);
	}
	/**
	 * Listener function when connected users changes
	 * @param {Object} payload
	 */
	function ioListenerConnectedUsersReceived(payload) {
		const { arrayOfUsers } = payload;
		const newMap = new Map();
		arrayOfUsers.forEach((user) => newMap.set(user, user));
		setConnectedUsers(newMap);
	}
	/**
	 * Listener function when this socket leaves a room he is part of,
	 * may not always be done by ownself (ex: room owner deletes the room, while user in other room)
	 * @param {Object} payload
	 */
	function ioListenerSocketLeftRoom(payload) {
		const { leftRoomName, situation } = payload;
		//console.log("Removing Room from state:", leftRoomName);
		// Remove room from state
		removeRoomFromState(leftRoomName);
		removeUnreadMessageCountFromState(leftRoomName);

		// currentRoom was deleted, return to default room
		if (selectedRoomObj.name === leftRoomName) {
			setSelectedRoomObj(roomObjMap.values().next().value);
			disableOverlay();
		}

		// Set up notification depending on situation
		if (situation.roomDeleted) setNotificationClipDetails({ active: true, message: `${leftRoomName} was deleted` });
		else if (situation.leftRoom) setNotificationClipDetails({ active: true, message: `Left ${leftRoomName}` });
	}
	/**
	 * Listener function when OTHER socket Joined/Left a room
	 * @param {Object} payload
	 */
	function ioListenerOtherSocketJoinedLeftRoom(payload) {
		const { joined, roomName, username } = payload;
		//console.log(username + (joined ? " joining " : " leaving ") + roomName);
		// Find the room to modify
		const newMap = new Map(roomObjMap);
		const roomToModify = newMap.get(roomName);
		// User join room or leaving room
		if (joined) roomToModify.users.push(username);
		else {
			const userIndex = roomToModify.users.findIndex((nameInArray) => nameInArray.toLowerCase() === username.toLowerCase());
			roomToModify.users.splice(userIndex, 1);
		}
		// Update state
		setRoomObjMap(newMap);
	}
	/**
	 * Listener function when a room owner changes
	 * @param {Object} payload
	 */
	function ioListenerUpdateRoomOwner(payload) {
		const { newOwnerusername, roomName } = payload;
		//console.log("Room [" + roomName + "] got new Owner: " + newOwnerusername);
		// Change owner of room and Update State
		const newMap = new Map(roomObjMap);
		newMap.get(roomName).owner = newOwnerusername;
		setRoomObjMap(newMap);
	}
	/**
	 * Listener function to refresh room users array
	 * @param {Object} payload
	 */
	async function ioListenerRefreshRoomUsersArray(payload) {
		const { roomName } = payload;
		// Get data from MongoDB
		let result = await fetch(process.env.REACT_APP_SERVERURL + "/chat/myrooms", {
			headers: {
				username: authUser.getUsername(),
				roomName: roomName,
				jwtAuth: authUser.getJWT(),
			},
		});
		const roomResultJSON = await result.json();
		const newUsersArray = roomResultJSON.rooms.users;
		//console.log("Room [" + roomName + "] refreshing users array: " + newUsersArray);
		// Change users of room and Update State
		const newMap = new Map(roomObjMap);
		newMap.get(roomName).users = newUsersArray;
		setRoomObjMap(newMap);
	}

	// Component Props
	let chatOverlayProps = {
		renderOverlay,
		overlayDetails,
		closeOverlayFunc: disableOverlay,
		createNewRoomFunc: createNewRoom,
		deleteRoomFunc: deleteRoom,
		leaveRoomFunc: leaveRoom,
		handleLogoutFunc: authUser.handleLogout,
		currentUsername: authUser.getUsername(),
		currentRoomObj: selectedRoomObj,
		connectedUsersMap: connectedUsers,
		isRoomOwner: selectedRoomObj.owner === authUser.getUsername(),
	};
	return (
		<div>
			<LoadingAndErrorOverlay logOutFunc={authUser.handleLogout} loading={isDataStillLoading()} error={socketInstance.isSocketError()} />
			{dataLoaded && (
				<Box>
					<ChatOverlay {...chatOverlayProps} />
					<Box sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "space-around" }, alignItems: "center" }}>
						<RoomList
							roomMap={roomObjMap}
							unreadMessagesMap={unreadMessagesMap}
							selectedRoomName={selectedRoomObj.name}
							selectedRoomChangedFunc={newSelectedRoom}
							openNewRoomOverlay={enableNewRoomOverlay}
						/>
						<ChatRoomLog
							ownUsername={authUser.getUsername()}
							chatLog={chatLog[selectedRoomObj.name] ? chatLog[selectedRoomObj.name] : []}
							selectedRoomObj={selectedRoomObj}
							openRoomDetailsFunc={enableNewRoomOverlay}
							submitFieldValueFunc={ioEmitMessage}
						/>
					</Box>
					<NotificationChip chipDetails={notificationChipDetails} removeChipFunc={closeNotificationChip} />
				</Box>
			)}
		</div>
	);
};

export default Chat;
