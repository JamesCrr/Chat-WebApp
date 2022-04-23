import { styled, Paper, Typography, Button } from "@mui/material";

const OverlayContainer = styled(Paper, { shouldForwardProp: (prop) => prop !== "active" })(({ active, theme }) => ({
	transition: "opacity 0.5s, visibility 0s 0.5s",
	position: "absolute",
	zIndex: "100",

	opacity: active ? "1" : "0",
	visibility: active ? "visible" : "hidden",
	background: theme.palette.background.paper,
	boxShadow: "none",
	borderRadius: "0px",
	height: "100vh",
	width: "100vw",

	display: "flex",
	justifyContent: "center",
	alignItems: "center",
}));
const ErrorContainer = styled(Paper)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-around",
	alignItems: "center",
	flexDirection: "column",
	width: "50%",
	height: "50%",
	background: theme.palette.background.default,
}));
const LogOutButton = styled(Button)(({ theme }) => ({
	color: theme.palette.text.primary,
	background: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main,

	"@media (hover:hover)": {
		"&:hover": {
			background: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark,
		},
	},
}));

const AppOverlay = ({ logOutFunc, loading, error }) => {
	/**
	 * Logic that decides whether the overlay should be active
	 * @returns Boolean
	 */
	const getFinalActiveValue = () => {
		if (loading || error) return true;
		return false;
	};
	/**
	 * Gets the correct component to render based on props
	 * @returns Component to render
	 */
	const getComponentToRender = () => {
		if (error)
			return (
				<ErrorContainer>
					<Paper sx={{ background: "none", boxShadow: "none", borderRadius: "0px", textAlign: "center" }}>
						<Typography color={(theme) => theme.palette.error.dark} variant="h3">
							Server Error
						</Typography>
						<Typography color={(theme) => theme.palette.text.secondary} variant="h3">
							Please try again later..
						</Typography>
					</Paper>
					<LogOutButton variant="contained" onClick={logOutFunc}>
						Log out
					</LogOutButton>
				</ErrorContainer>
			);
		else if (loading) return <Typography variant="h2">Loading..</Typography>;
		return <></>;
	};

	return <OverlayContainer active={getFinalActiveValue()}>{getComponentToRender()}</OverlayContainer>;
};

export default AppOverlay;
