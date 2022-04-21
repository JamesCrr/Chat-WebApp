import { useEffect, useState } from "react";
import { styled, Box, Paper, Typography } from "@mui/material";

const RoomListItemContainer = styled(Box)(({ selected, theme }) => ({
	backgroundColor: selected ? "red" : "green",
	width: "100%",
	height: "5%",
	paddingTop: "5px",
	paddingBottom: "5px",

	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
}));
const UnreadCounterContainer = styled(Paper, { shouldForwardProp: (prop) => prop !== "active" })(({ active, theme }) => ({
	opacity: active ? "1" : "0",
	display: active ? "block" : "none",

	marginRight: "2%",
	background: theme.palette.background.paper,
	padding: "2%",
}));

const RoomListItem = ({ roomObj, unreadCount, onItemClicked }) => {
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
			<Typography variant="h6" sx={{ marginLeft: "5%", overflow: "clip", textOverflow: "ellipsis" }}>
				{roomDetails ? roomDetails.name : ""}
			</Typography>
			<UnreadCounterContainer active={unreadCount > 0}>
				<Typography variant="caption">{unreadCount}</Typography>
			</UnreadCounterContainer>
		</RoomListItemContainer>
	);
};

export default RoomListItem;
