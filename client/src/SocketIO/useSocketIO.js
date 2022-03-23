import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// useRef instead of this??
// Tested when rerendering but was NOT set back to null
// Might cause errors in the future but nt sure also
let socketRef = null;
const useSocketIO = (auth, errorCallback) => {
	const [currentRoom, setCurrentRoom] = useState(null);

	useEffect(() => {
		// const connectTimeOut = setTimeout(() => connectSocket(), 500); clearTimeout(connectTimeOut);
		connectSocket();
		const socketJoinRooms = setTimeout(makeSocketJoinUserRooms, 500);
		// Prevent memory leak if component was unmounted bfr being called
		return () => {
			clearInterval(socketJoinRooms);
		};
	}, []);

	/**
	 * Connects the socket to the Server
	 */
	const connectSocket = () => {
		socketRef = io("http://localhost:5000", { auth: { token: auth.getJWT() } });
		socketRef.on("connect_error", (err) => {
			console.log("SocketIO Connect Error:", err.message);
			// Disconnect socket and call connection callback
			disconnectSocket();
			errorCallback();
		});
	};
	/**
	 * Disconnects the socket from the Server,
	 */
	const disconnectSocket = () => {
		if (!socketRef) return;
		socketRef.disconnect();
		socketRef = null;
	};
	/**
	 * Makes socket join all the rooms that user is in
	 */
	const makeSocketJoinUserRooms = async () => {
		// Get all rooms user is in
		const result = await fetch("http://localhost:5000/chat/myrooms", {
			headers: {
				_dbId: auth.getDBID(),
			},
		});
		const resultJSON = await result.json();
		//	TEMP SETTING STARTING ROOM HERER
		setCurrentRoom(resultJSON.rooms[0]);
		//******************************** */
		// Send to SocketIO
		socketRef.emit("joinroom", resultJSON.rooms);
	};

	/******** Temp ********/
	const changeCurrentRoom = (newRoom) => {
		setCurrentRoom(newRoom);
	};
	const printSocketRef = () => {
		console.log(socketRef);
	};
	// TESTING  register listener function for socket events
	const registerListener = (eventName, listenerFunc) => {
		if (!socketRef) return;
		socketRef.on(eventName, listenerFunc);
	};
	const unregisterListener = (eventName, listenerFunc) => {
		if (!socketRef) return;
		socketRef.off(eventName, listenerFunc);
	};
	// TESTING emit message to socket server
	const emitMessage = (message) => {
		socketRef.emit("chatmessage", { targetRoom: currentRoom, message, username: auth.getUsername() });
	};
	/*********************************/

	return { disconnectSocket, unregisterListener, registerListener, emitMessage, changeCurrentRoom, printSocketRef };
};

export default useSocketIO;
