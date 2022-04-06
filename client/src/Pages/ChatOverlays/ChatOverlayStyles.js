import { styled, Box, Typography, IconButton } from "@mui/material";

const OverlayBox = styled(Box)(({ theme }) => ({
	position: "absolute",
	zIndex: "1",
	display: "flex",
	justifyContent: "center",
	backgroundColor: "rgba(100, 100, 100, 0.8)",
	height: "100%",
	width: "100%",
}));
const CloseOverlayButton = styled(IconButton)(({ theme }) => ({
	border: "2.5px solid red",
	borderRadius: "30px",
	padding: "1px",
	background: "rgba(255, 255, 255)",
	transition: "box-shadow 0.3s ease-out",
	":hover": {
		background: "rgba(235, 235, 235)",
		boxShadow: "0px 8px 20px -7px grey",
	},
}));
const ParentContentBox = styled(Box)(({ ownWidth, ownHeight, theme }) => ({
	textAlign: "center",
	borderRadius: "10px",
	marginTop: "5%",
	width: ownWidth,
	height: ownHeight,
	background: theme.palette.background.default,
}));
const AddNewRoomContentBox = styled(Box)(({ theme }) => ({
	height: "70%",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "space-around",
	textAlign: "center",
}));
const RoomDetailsContentBox = styled(Box)(({ theme }) => ({
	height: "70%",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "space-around",
	textAlign: "center",
}));

const ErrorTypography = styled(Typography)(({ theme }) => ({
	wordWrap: "break-word",
	color: "#ff1212",
}));

export { OverlayBox, CloseOverlayButton, ParentContentBox, RoomDetailsContentBox, AddNewRoomContentBox, ErrorTypography };
