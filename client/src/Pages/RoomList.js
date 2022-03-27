import { styled, Box } from "@mui/material";
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

const RoomList = ({ roomArray, currentRoom, currentRoomChangedFunc }) => {
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
