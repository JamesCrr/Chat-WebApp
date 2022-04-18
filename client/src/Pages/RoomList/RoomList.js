import { styled, Box, Button } from "@mui/material";
import RoomListItem from "./RoomListItem";
import { OVERLAYTYPES } from "../ChattingApp";

const RoomListContainer = styled(Box)(({ theme }) => ({
	height: "100vh",
	width: "20%",
	overflowY: "scroll",
	background: theme.palette.background.paper,
	transition: `background ${theme.palette.transitionTime}`,

	/* Hide scrollbar for Chrome, Safari and Opera */
	"::-webkit-scrollbar": { display: "none" },
	msOverflowStyle: "none" /* IE and Edge */,
	scrollbarWidth: "none" /* Firefox */,
}));
const RoomListParent = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-start",
	alignItems: "center",
}));

const RoomList = ({ roomArray, selectedRoomName, selectedRoomChangedFunc, openNewRoomOverlay }) => {
	// console.log("RooomList Render", roomArray, currentRoom);

	/**
	 * When the room list item was clicked
	 * @param {Object} roomDetails Room details
	 */
	const onRoomItemClicked = (roomDetails) => {
		console.log("RoomClicked:", roomDetails.name);
		selectedRoomChangedFunc(roomDetails);
	};

	return (
		<RoomListContainer>
			<Button onClick={() => openNewRoomOverlay(OVERLAYTYPES.NEWROOM)}>Add</Button>
			<RoomListParent>
				{roomArray.map((roomObj) => {
					return <RoomListItem key={roomObj.name} roomObj={roomObj} onItemClicked={onRoomItemClicked} />;
				})}
			</RoomListParent>
		</RoomListContainer>
	);
};

export default RoomList;
