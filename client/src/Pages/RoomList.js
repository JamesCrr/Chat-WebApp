import { styled, Box, TextField } from "@mui/material";
import { useState } from "react";
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

	height: "100vh",
	overflow: "scroll",

	/* Hide scrollbar for Chrome, Safari and Opera */
	"::-webkit-scrollbar": { display: "none" },
	//  -ms-overflow-style: none;  /* IE and Edge */
	scrollbarWidth: "none" /* Firefox */,
}));
const RoomListTextField = styled(TextField)(({ theme }) => ({
	width: "100%",
}));

const RoomList = ({ roomArray, currentRoomObj, currentRoomChangedFunc, createNewRoomFunc }) => {
	const [fieldValue, setFieldValue] = useState("");

	/**
	 * When the room list item was clicked
	 * @param {Object} roomDetails Room details
	 */
	const onRoomItemClicked = (roomDetails) => {
		console.log("RoomClicked:", roomDetails.name);
		currentRoomChangedFunc(roomDetails.name);
	};

	const onFieldValueChange = (e) => {
		setFieldValue(e.target.value);
	};
	const onFieldValueSubmit = (e) => {
		e.preventDefault();
		createNewRoomFunc(fieldValue);
		setFieldValue("");
	};

	return (
		<RoomListContainer>
			<RoomListParent>
				{roomArray.map((roomObj) => {
					return <RoomListItem key={Math.random()} roomObj={roomObj} onItemClicked={onRoomItemClicked} />;
				})}
				<form onSubmit={onFieldValueSubmit}>
					<RoomListTextField value={fieldValue} onChange={onFieldValueChange} variant="outlined" />
				</form>
			</RoomListParent>
		</RoomListContainer>
	);
};

export default RoomList;
