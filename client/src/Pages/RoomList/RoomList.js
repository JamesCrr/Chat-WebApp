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

const RoomList = ({ roomMap, unreadMessagesMap, selectedRoomName, selectedRoomChangedFunc, openNewRoomOverlay }) => {
	/**
	 * When the room list item was clicked
	 * @param {Object} roomDetails Room details
	 */
	const onRoomItemClicked = (roomDetails) => {
		console.log("RoomClicked:", roomDetails.name);
		selectedRoomChangedFunc(roomDetails);
	};

	/**
	 * Converts map object into an array of components to render
	 * @returns An array of components
	 */
	const renderRoomMap = () => {
		const resultArray = [];
		roomMap.forEach((value, key) => {
			resultArray.push(<RoomListItem key={value.name} roomObj={value} unreadCount={unreadMessagesMap.get(key)} onItemClicked={onRoomItemClicked} />);
		});
		return resultArray;
	};

	return (
		<RoomListContainer>
			<Button onClick={() => openNewRoomOverlay(OVERLAYTYPES.NEWROOM)}>Add</Button>
			<RoomListParent>{renderRoomMap()}</RoomListParent>
		</RoomListContainer>
	);
};

export default RoomList;
