import { styled, useTheme, Paper, Box, Button, IconButton, Typography } from "@mui/material";
import RoomListItem from "./RoomListItem";
import { OVERLAYTYPES } from "../ChattingApp";
import { useState } from "react";

const RoomListContainer1 = styled(Box, { shouldForwardProp: (prop) => prop !== "sidebarActive" })(({ sidebarActive, theme }) => ({
	height: "100vh",
	background: theme.palette.background.paper,
	transition: `width 0.3s, background ${theme.palette.transitionTime}`,

	[theme.breakpoints.up("xs")]: {
		width: sidebarActive ? "80%" : "0%",

		position: "absolute",
		zIndex: "2",
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	[theme.breakpoints.up("sm")]: {
		width: "20%",
		position: "static",
		display: "block",
	},
}));
const SidebarButtonContainer = styled(Paper)(({ theme }) => ({
	position: "absolute",
	zIndex: "1",
	background: "none",
	boxShadow: "none",
	marginLeft: "100%",
	transform: "scale(1.8) translateX(-14px)",

	[theme.breakpoints.up("xs")]: {
		display: "block",
	},
	[theme.breakpoints.up("sm")]: {
		display: "none",
	},
}));
const SidebarButton = styled(IconButton, { shouldForwardProp: (prop) => prop !== "sidebarActive" })(({ sidebarActive, theme }) => ({
	background: theme.palette.background.paperer,
	transition: `background ${theme.palette.transitionTime}`,
	borderRadius: "30px",
	opacity: sidebarActive ? "1" : "0.5",

	"& .hover": {
		background: theme.palette.background.paper,
	},
}));
const SidebarIconSVG = styled("svg", { shouldForwardProp: (prop) => prop !== "sidebarActive" })(({ sidebarActive, theme }) => ({
	transition: "transform 0.4s",
	transform: `translateX(11px) ${sidebarActive ? "rotate(-180deg)" : "rotate(0deg)"}`,
	width: "24px",
	height: "24px",
}));
const RoomListBoxBackground = styled(Box, { shouldForwardProp: (prop) => prop !== "sidebarActive" })(({ sidebarActive, theme }) => ({
	height: "100%",
	width: "100%",
	background: theme.palette.background.paper,
	transition: `background ${theme.palette.transitionTime}`,
	display: "block",
	position: "absolute",
	zIndex: "2",
}));
const RoomListBox2 = styled(Box, { shouldForwardProp: (prop) => prop !== "sidebarActive" })(({ sidebarActive, theme }) => ({
	height: "100%",
	width: "100%",
	background: theme.palette.background.paper,
	transition: `opacity 0.3s, background ${theme.palette.transitionTime}`,
	display: "block",
	position: "relative",
	zIndex: "2",

	overflowY: "scroll",
	/* Hide scrollbar for Chrome, Safari and Opera */
	"::-webkit-scrollbar": { display: "none" },
	msOverflowStyle: "none" /* IE and Edge */,
	scrollbarWidth: "none" /* Firefox */,

	[theme.breakpoints.up("xs")]: {
		alignSelf: "start",
		opacity: sidebarActive ? "1" : "0",
	},
	[theme.breakpoints.up("sm")]: {
		opacity: "1",
	},
}));
const AddRoomButton = styled(Button)(({ theme }) => ({
	width: "100%",
	borderRadius: "20px",
	marginTop: "2px",

	background: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main,
	"&:hover": {
		background: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark,
	},
}));
const RoomListParent = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-start",
	alignItems: "center",
}));

const RoomList = ({ roomMap, unreadMessagesMap, selectedRoomName, selectedRoomChangedFunc, openNewRoomOverlay }) => {
	// For mobile view only
	const [sidebarActive, setSidebarActive] = useState(false);
	const theme = useTheme();

	/**
	 * When the room list item was clicked
	 * @param {Object} roomDetails Room details
	 */
	const onRoomItemClicked = (roomDetails) => {
		console.log("RoomClicked:", roomDetails.name);
		selectedRoomChangedFunc(roomDetails);
	};

	const onSidebarButtonClicked = (e) => {
		setSidebarActive(!sidebarActive);
	};

	/**
	 * Converts map object into an array of components to render
	 * @returns An array of components
	 */
	const renderRoomMap = () => {
		const resultArray = [];
		roomMap.forEach((value, key) => {
			resultArray.push(
				<RoomListItem
					key={value.name}
					selected={selectedRoomName === value.name}
					roomObj={value}
					unreadCount={unreadMessagesMap.get(key)}
					onItemClicked={onRoomItemClicked}
				/>
			);
		});
		return resultArray;
	};

	return (
		<RoomListContainer1 sidebarActive={sidebarActive}>
			<RoomListBoxBackground sidebarActive={sidebarActive}></RoomListBoxBackground>
			<RoomListBox2 sidebarActive={sidebarActive}>
				<AddRoomButton variant="contained" onClick={() => openNewRoomOverlay(OVERLAYTYPES.NEWROOM)}>
					<Typography fontWeight={"bold"} variant="button">
						Add / Join
					</Typography>
				</AddRoomButton>
				<RoomListParent>{renderRoomMap()}</RoomListParent>
			</RoomListBox2>
			<SidebarButtonContainer>
				<SidebarButton sidebarActive={sidebarActive} onClick={onSidebarButtonClicked} disableFocusRipple disableRipple>
					<SidebarIconSVG sidebarActive={sidebarActive} viewBox="0 0 24 24">
						<path
							fill={theme.palette.primary.main}
							d="M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z"
						/>
					</SidebarIconSVG>
				</SidebarButton>
			</SidebarButtonContainer>
		</RoomListContainer1>
	);
};

export default RoomList;
