import { styled, Paper, Box, Button, Typography } from "@mui/material";

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
}));
const ContentPaper = styled(Paper)(({ theme }) => ({
	padding: "24px 48px 48px 48px",
	background: theme.palette.background.paper,
}));
const PageTitle = styled(Typography)(({ theme }) => ({
	paddingBottom: "6%",
	color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
}));
const ButtonPaper = styled(Box)(({ theme }) => ({
	marginTop: "36px",
	marginBottom: "12px",
}));
const SubmitButton = styled(Button)(({ theme }) => ({}));
const AlternativeOptionTraverseLink = styled(Typography)(({ theme }) => ({
	display: "inline",
	textDecoration: `underline ${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main} solid 3px`,
	background: "none",
	borderRadius: "5px",
	transition: "background 0.4s",

	// Prevent sticky hover
	"@media (hover:hover)": {
		"&:hover": {
			background: `${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main}`,
		},
	},
}));

export { PageBackgroundPaper, ContentBox, ContentPaper, PageTitle, ButtonPaper, SubmitButton, AlternativeOptionTraverseLink };
