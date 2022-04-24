import { useEffect, useRef, useState } from "react";
import { styled, Box, Paper, Typography } from "@mui/material";

const RoomListItemContainer = styled(Box)(({ selected, theme }) => ({
	transition: `background ${theme.palette.transitionTime}, border 0.2s, border-radius 0.2s`,
	boxSizing: "border-box",
	background: selected ? theme.palette.background.paperer : theme.palette.background.paper,
	borderRadius: selected ? "6px" : "0px",
	borderLeft: selected
		? `4px solid ${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main}`
		: `3px solid ${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main}`,
	borderRight: selected
		? `4px solid ${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main}`
		: `3px solid ${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main}`,
	borderTop: selected ? `4px solid ${theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark}` : "none",
	borderBottom: selected ? `4px solid ${theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark}` : "none",
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
const TitleTypography = styled(Typography)(({ selected, theme }) => ({
	color: selected ? theme.palette.text.primary : theme.palette.text.secondary,

	marginLeft: "5%",
	overflow: "clip",
	textOverflow: "ellipsis",
}));
const UnreadCounterContainer = styled(Paper, { shouldForwardProp: (prop) => prop !== "active" })(({ active, theme }) => ({
	transition: `background ${theme.palette.transitionTime}, color ${theme.palette.transitionTime}, opacity ${theme.palette.transitionTime}`,
	background: theme.palette.mode === "dark" ? theme.palette.error.main : theme.palette.error.main,
	opacity: active ? "1" : "0",
	display: "block",
	color: theme.palette.text.primary,
	fontSize: "0.95rem",
	fontWeight: "bold",
	marginRight: "2%",
	padding: "2%",

	[theme.breakpoints.down("sm")]: {
		fontSize: "0.75rem",
		padding: "2%",
	},
}));

const RoomListItem = ({ selected, roomObj, unreadCount, onItemClicked }) => {
	const [roomDetails, setRoomDetails] = useState(null);
	const lastUnreadCountRef = useRef(0);

	useEffect(() => setRoomDetails(roomObj), [roomObj]);
	useEffect(() => {
		if (unreadCount > 0) lastUnreadCountRef.current = unreadCount;
	}, [unreadCount]);

	const onContainerClicked = (e) => {
		onItemClicked(roomDetails);
	};

	return (
		<RoomListItemContainer selected={selected} onClick={onContainerClicked}>
			<TitleTypography selected={selected} variant="h6">
				{roomDetails ? roomDetails.name : ""}
			</TitleTypography>
			<UnreadCounterContainer active={unreadCount > 0}>{unreadCount > 0 ? unreadCount : lastUnreadCountRef.current}</UnreadCounterContainer>
		</RoomListItemContainer>
	);
};

export default RoomListItem;
