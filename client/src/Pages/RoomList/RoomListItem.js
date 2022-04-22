import { useEffect, useState } from "react";
import { styled, Box, Paper, Typography } from "@mui/material";

const RoomListItemContainer = styled(Box)(({ selected, theme }) => ({
	background: theme.palette.background.paperer,
	transition: `background ${theme.palette.transitionTime}`,
	transition: "background 0.25s, border 0.4s, border-radius 0.4s",
	boxSizing: "border-box",
	borderLeft: selected ? `10px solid ${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main}` : "none",
	borderRight: selected ? `5px solid ${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main}` : "none",
	// Prevent sticky hovering
	"@media (hover: hover)": {
		"&:hover": {
			cursor: "pointer",
			background: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark,
		},
	},

	width: "100%",
	height: "5%",
	marginTop: "4px",
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

const RoomListItem = ({ selected, roomObj, unreadCount, onItemClicked }) => {
	const [roomDetails, setRoomDetails] = useState(null);

	useEffect(() => {
		setRoomDetails(roomObj);
	}, [roomObj]);

	const onContainerClicked = (e) => {
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
