import { useEffect, useState } from "react";
import { styled, Box, Typography } from "@mui/material";

const RoomListItemContainer = styled(Box)(({ theme }) => ({
	backgroundColor: "green",
	width: "100%",
	padding: "1rem",
}));

const RoomListItem = ({ roomObj, onItemClicked }) => {
	const [roomDetails, setRoomDetails] = useState(null);

	useEffect(() => {
		setRoomDetails(roomObj);
	}, [roomObj]);

	return (
		<RoomListItemContainer onClick={() => onItemClicked(roomDetails)}>
			<Typography>{roomDetails ? roomDetails.name : ""}</Typography>
		</RoomListItemContainer>
	);
};

export default RoomListItem;
