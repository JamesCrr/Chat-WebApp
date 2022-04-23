import { styled, Paper, Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const PageBackgroundPaper = styled(Paper)(({ theme }) => ({
	boxSizing: "border-box",
	height: "100vh",
	width: "100vw",
	background: "none",
	borderRadius: "0px",
	background: theme.palette.background.default,
}));
const ContentBox = styled(Box)(({ theme }) => ({
	boxSizing: "border-box",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	marginTop: "30px",

	[theme.breakpoints.down("sm")]: {
		marginTop: "20px",
	},
}));
const ContentPaper = styled(Paper)(({ theme }) => ({
	padding: "24px 48px 48px 48px",
	background: theme.palette.background.paper,

	"@media only screen and (max-width: 305px)": {
		padding: "12px 24px 24px 24px",
	},
	[theme.breakpoints.down("sm")]: {},
}));
const PageTitle = styled(Typography)(({ theme }) => ({
	paddingBottom: "6%",
	color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
}));
const ErrorMessagePaper = styled(Paper, { shouldForwardProp: (props) => props !== "errorActive" })(({ errorActive, theme }) => ({
	marginTop: "2px",
	boxShadow: "none",
	borderRadius: "0px",
	background: "none",
	fontWeight: "bold",
	fontSize: "0.8rem",
	textAlign: "left",
	transition: `opacity 0.3s, color ${theme.palette.transitionTime}`,
	opacity: errorActive ? "1" : "0",
	color: theme.palette.mode === "dark" ? theme.palette.error.main : theme.palette.error.dark,
}));
const ButtonBox = styled(Box)(({ theme }) => ({
	marginTop: "36px",
	marginBottom: "12px",
}));
const SubmitButton = styled(LoadingButton)(({ theme }) => ({
	transition: `color ${theme.palette.transitionTime}, background ${theme.palette.transitionTime}`,
	color: theme.palette.text.primary,
	background: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main,

	"@media (hover:hover)": {
		"&:hover": {
			background: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark,
		},
	},
}));
const AlternativeOptionTraverseLink = styled(Typography)(({ theme }) => ({
	display: "inline",
	textDecoration: `underline ${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main} solid 3px`,
	background: "none",
	borderRadius: "5px",
	transition: "background 0.4s, color 0.4s",
	color: theme.palette.text.secondary,

	// Prevent sticky hover
	"@media (hover:hover)": {
		"&:hover": {
			background: `${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main}`,
		},
	},
}));

export { PageBackgroundPaper, ContentBox, ContentPaper, PageTitle, ErrorMessagePaper, ButtonBox, SubmitButton, AlternativeOptionTraverseLink };
