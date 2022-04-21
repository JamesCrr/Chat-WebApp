import { styled, Box, Paper, Button, Typography, IconButton, Stack } from "@mui/material";

const OverlayBox = styled(Box)(({ theme }) => ({
	position: "absolute",
	zIndex: "10",
	display: "flex",
	justifyContent: "center",
	backgroundColor: theme.palette.mode === "light" ? "rgba(100, 100, 100, 0.8)" : "rgba(50, 50, 50, 0.9)",
	transition: `backgroundColor ${theme.palette.transitionTime}`,
	height: "100%",
	width: "100%",
}));
const ParentContentPaper = styled(Paper)(({ ownwidth, ownheight, theme }) => ({
	textAlign: "center",
	borderRadius: "10px",
	marginTop: "2%",
	width: ownwidth,
	height: ownheight,
	background: theme.palette.background.default,
}));
const CloseOverlayButton = styled(IconButton)(({ theme }) => ({
	border: "2.5px solid red",
	borderRadius: "30px",
	padding: "1px",
	background: theme.palette.background.default,
	transition: "box-shadow 0.3s ease-out",
	":hover": {
		boxShadow: "0px 8px 20px -7px grey",
	},
}));

/**
 *
 */
const AddNewRoomContentBox = styled(Box)(({ theme }) => ({
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

/**
 *
 */
const RoomDetailsContentBox = styled(Box)(({ theme }) => ({
	height: "75%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	alignItems: "center",
	textAlign: "center",
	overflowY: "scroll",
	/* Hide scrollbar for Chrome, Safari and Opera */
	"::-webkit-scrollbar": { display: "none" },
	msOverflowStyle: "none" /* IE and Edge */,
	scrollbarWidth: "none" /* Firefox */,
}));
const MembersContainer = styled(Paper)(({ theme }) => ({
	background: "none",
	boxShadow: "none",
	textAlign: "left",
	width: "80%",
	marginTop: "2%",
}));
const MembersTitleContainer = styled(Paper)(({ theme }) => ({
	background: theme.palette.background.default,
	boxShadow: "none",
	borderBottom: `4px ${theme.palette.text.primary} solid`,
	borderRadius: "4px 4px 0px 0px",
	marginBottom: "5px",
}));
const MembersListParent = styled(Stack)(({ theme }) => ({
	background: theme.palette.background.default,
}));
const MembersItem = styled(Paper, { shouldForwardProp: (prop) => prop !== "ownself" && prop !== "online" })(({ ownself, online, theme }) => ({
	background: online ? theme.palette.success.main : theme.palette.background.paper,
	boxSizing: "border-box",
	borderLeft: ownself ? "10px solid" : "none",
	borderRadius: "0px 0px 4px 4px",
	fontWeight: ownself ? "bold" : "none",
	padding: "5px",
	paddingLeft: "10px",
}));
const RoomDetailsDangerZone = styled(Paper)(({ theme }) => ({
	width: "70%",
	border: `3px solid ${theme.palette.error.dark}`,
	borderStyle: "solid",
	marginTop: "4%",
}));
const RoomDetailDangerProperty = styled(Paper)(({ theme }) => ({
	textAlign: "left",
	padding: "3%",
}));
const RoomDetailsDangerButton = styled(Button)(({ disabled, theme }) => ({
	backgroundColor: "#1c040426",
	display: "inline-block",
	float: "right",
	border: `1px solid ${theme.palette.error.dark}`,
	boxShadow: disabled ? "" : " rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
}));

export {
	OverlayBox,
	CloseOverlayButton,
	ParentContentPaper,
	AddNewRoomContentBox,
	ErrorTypography,
	RoomDetailsContentBox,
	MembersContainer,
	MembersTitleContainer,
	MembersListParent,
	MembersItem,
	RoomDetailsDangerZone,
	RoomDetailDangerProperty,
	RoomDetailsDangerButton,
};
