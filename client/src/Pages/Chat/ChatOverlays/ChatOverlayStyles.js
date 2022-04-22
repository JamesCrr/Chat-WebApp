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
	background: theme.palette.background.paper,
	transition: "box-shadow 0.3s ease-out, background 0.3s",
	":hover": {
		background: theme.palette.primary.main,
		boxShadow: "0px 8px 10px -7px black",
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
const AddNewRoomButton = styled(Button)(({ theme }) => ({
	marginTop: "5%",
	display: "block",
	background: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main,

	"&:hover": {
		background: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark,
	},
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
	background: theme.palette.background.paper,
	boxShadow: "10px 10px 12px 0px rgba(0, 0, 0, 0.6)",
	boxSizing: "border-box",
	textAlign: "left",
	padding: "10px",
	width: "80%",
	marginTop: "24px",
	marginBottom: "12px",
}));
const MembersTitleContainer = styled(Paper)(({ theme }) => ({
	background: "none",
	boxShadow: "none",
	borderBottom: `4px ${theme.palette.text.secondary} solid`,
	borderRadius: "4px 4px 0px 0px",
}));
const MembersListParent = styled(Stack)(({ theme }) => ({
	background: "none",
	paddingTop: "5px",
}));
const MembersItem = styled(Paper, { shouldForwardProp: (prop) => prop !== "ownself" && prop !== "online" })(({ ownself, online, theme }) => ({
	background: online ? (theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main) : theme.palette.background.paper,
	color: online ? theme.palette.text.primary : theme.palette.text.disabled,
	boxSizing: "border-box",
	borderLeft: ownself ? "10px solid" : "none",
	borderRadius: "0px 0px 4px 4px",
	fontWeight: ownself ? "bold" : "none",
	padding: "5px",
	paddingLeft: "10px",
}));
const RoomDetailsDangerZone = styled(Paper)(({ theme }) => ({
	width: "70%",
	border: `5px solid ${theme.palette.error.dark}`,
	borderStyle: "solid",

	marginTop: "4%",
	boxShadow: "10px 10px 12px 0px rgba(0, 0, 0, 0.6)",
}));
const RoomDetailDangerProperty = styled(Paper)(({ theme }) => ({
	background: theme.palette.background.paper,
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
	AddNewRoomButton,
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
