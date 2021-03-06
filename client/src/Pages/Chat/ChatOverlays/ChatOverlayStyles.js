import { styled, Box, Paper, Button, Typography, IconButton, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const OverlayBox = styled(Box)(({ theme }) => ({
	position: "absolute",
	zIndex: "10",
	display: "flex",
	justifyContent: "center",
	backgroundColor: theme.palette.mode === "light" ? "rgba(100, 100, 100, 0.8)" : "rgba(50, 50, 50, 0.9)",
	transition: `backgroundColor ${theme.palette.transitionTime}`,
	minHeight: "100vh",
	minHeight: "-webkit-fill-avaliable",
	height: "100vh",
	width: "100%",
}));
const ParentContentPaper = styled(Paper, { shouldForwardProp: (props) => props !== "newRoom" })(({ newRoom, theme }) => ({
	textAlign: "center",
	boxSizing: "border-box",
	borderRadius: "10px",
	marginTop: "2%",
	width: newRoom ? "40%" : "80%",
	height: newRoom ? "70%" : "90%",
	background: theme.palette.background.default,

	[theme.breakpoints.down("sm")]: {
		width: newRoom ? "80%" : "95%",
		height: newRoom ? "70%" : "95%",
	},
}));
const CloseOverlayButton = styled(IconButton)(({ theme }) => ({
	border: `2.5px solid ${theme.palette.error.dark}`,
	borderRadius: "30px",
	padding: "1px",
	background: theme.palette.background.default,
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
const AddNewRoomButton = styled(LoadingButton)(({ theme }) => ({
	marginTop: "5%",
	display: "block",
	fontWeight: "bold",
	fontSize: "1.2rem",
	transition: `color ${theme.palette.transitionTime}, background ${theme.palette.transitionTime}`,
	color: theme.palette.text.primary,
	background: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main,

	"& .MuiLoadingButton-loadingIndicator": {
		marginTop: "6px",
	},

	"@media (hover:hover)": {
		"&:hover": {
			background: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark,
		},
	},

	[theme.breakpoints.down("sm")]: {
		fontSize: "1rem",
	},
	"@media only screen and (max-width:400px)": {
		fontSize: "0.8rem",
	},
}));
const ErrorTypography = styled(Typography)(({ theme }) => ({
	wordWrap: "break-word",
	color: theme.palette.error.dark,
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
	width: "90%",
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
const DangerZoneMediaQuery_405 = "@media only screen and (max-width:405px)";
const RoomDetailsDangerZone = styled(Paper)(({ theme }) => ({
	width: "85%",
	boxSizing: "border-box",
	border: `5px solid ${theme.palette.error.dark}`,
	borderStyle: "solid",

	marginTop: "4%",
	boxShadow: "10px 10px 12px 0px rgba(0, 0, 0, 0.6)",
}));
const RoomDetailDangerProperty = styled(Paper)(({ theme }) => ({
	boxSizing: "border-box",
	background: theme.palette.background.paper,
	textAlign: "left",
	padding: "3%",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",

	[DangerZoneMediaQuery_405]: {
		flexDirection: "column",
		textAlign: "center",
	},
}));
const RoomDetailsDangerButton = styled(LoadingButton)(({ disabled, theme }) => ({
	display: "inline-block",
	float: "right",
	padding: "5px",
	color: theme.palette.text.primary,
	fontWeight: "10px",
	border: disabled ? "none" : `1px solid ${theme.palette.error.dark}`,
	background: disabled ? "none" : theme.palette.mode === "dark" ? theme.palette.error.dark : theme.palette.error.main,

	"@media (hover:hover)": {
		"&:hover": {
			boxShadow: disabled ? "" : " rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
			background: disabled ? "none" : theme.palette.mode === "dark" ? theme.palette.error.main : theme.palette.error.dark,
		},
	},

	[theme.breakpoints.down("md")]: {
		fontSize: "0.775rem",
		lineHeight: "1.1rem",
	},
	[theme.breakpoints.down("sm")]: {
		fontSize: "0.75rem",
		lineHeight: "1rem",
	},
	[DangerZoneMediaQuery_405]: {
		margin: "10px 0px",
	},
}));
const LogoutButton = styled(Button)(({ theme }) => ({
	marginTop: "24px",
	marginBottom: "2%",
	fontSize: "1.2rem",
	fontWeight: "bold",
	color: theme.palette.text.primary,
	background: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main,

	"&:hover": {
		background: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark,
	},

	[theme.breakpoints.down("sm")]: {
		fontSize: "1rem",
	},
	"@media only screen and (max-width:400px)": {
		fontSize: "0.8rem",
	},
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
	LogoutButton,
};
