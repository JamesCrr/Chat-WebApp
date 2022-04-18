import { useEffect, useState } from "react";
import { styled, Box, Typography } from "@mui/material";

const RoomListItemContainer = styled(Box)(({ selected, theme }) => ({
	backgroundColor: selected ? "red" : "green",
	width: "100%",
	height: "5%",
	paddingTop: "1rem",
	paddingBottom: "1rem",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
}));

const RoomListItem = ({ roomObj, onItemClicked }) => {
	const [roomDetails, setRoomDetails] = useState(null);
	const [selected, setSelected] = useState(false);

	useEffect(() => {
		setRoomDetails(roomObj);
	}, [roomObj]);

	const onContainerClicked = (e) => {
		setSelected(!selected);
		onItemClicked(roomDetails);
	};

	return (
		<RoomListItemContainer selected={selected} onClick={onContainerClicked}>
			<Typography sx={{ marginLeft: "5%" }}>{roomDetails ? roomDetails.name : ""}</Typography>
		</RoomListItemContainer>
	);
};

export default RoomListItem;
