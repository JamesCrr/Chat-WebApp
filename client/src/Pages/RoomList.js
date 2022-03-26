import { styled, Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import RoomListItem from "./RoomListItem";

const RoomListContainer = styled(Box)(({ theme }) => ({
	height: "100vh",
	width: "20%",
}));
const RoomListParent = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-start",
	alignItems: "center",
}));

// Could just immediately emit event joinrooms in Chat.js,
// but if socket was not connected, will not receive the event
// purpose of socketLoading is to wait till socketIO is connected bfr emitting events
const RoomList = ({ DBID, joinRoomsFunc, currentRoom, currentRoomChangedFunc }) => {
	const [roomArray, setRoomArray] = useState([]);

	useEffect(() => {
		fetchRoomData();
	}, []);

	/**
	 * Fetches Room data from the Database
	 */
	const fetchRoomData = async () => {
		// Get all rooms the user is in
		const result = await fetch("http://localhost:5000/chat/myrooms", {
			headers: {
				_dbId: DBID,
			},
		});
		const resultJSON = await result.json();
		setRoomArray(resultJSON.rooms);
		currentRoomChangedFunc(resultJSON.rooms[0]);
		joinRoomsFunc(resultJSON.rooms);
	};

	/**
	 * When the room list item was clicked
	 * @param {Object} roomDetails Room details
	 */
	const onRoomItemClicked = (roomDetails) => {
		console.log("RoomClicked:", roomDetails);
		currentRoomChangedFunc(roomDetails);
	};

	return (
		<RoomListContainer>
			<RoomListParent>
				{roomArray.map((roomObj) => {
					return <RoomListItem key={Math.random()} roomObj={roomObj} onItemClicked={onRoomItemClicked} />;
				})}
			</RoomListParent>
		</RoomListContainer>
	);
};

export default RoomList;
