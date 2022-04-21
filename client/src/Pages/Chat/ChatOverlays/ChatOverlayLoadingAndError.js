import { styled, Paper, Typography, Button } from "@mui/material";

const OverlayContainer = styled(Paper, { shouldForwardProp: (prop) => prop !== "active" })(({ active, theme }) => ({
	transition: "opacity 0.5s, visibility 0s 0.5s",
	position: "absolute",
	zIndex: "100",

	opacity: active ? "1" : "0",
	visibility: active ? "visible" : "hidden",
	background: theme.palette.background.default,
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
	background: theme.palette.background.paper,
}));
const LogOutButton = styled(Button)(({ theme }) => ({}));

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
					<Paper sx={{ boxShadow: "none", borderRadius: "0px", textAlign: "center" }}>
						<Typography variant="h3">Server Error..</Typography>
						<Typography variant="h3">Please try again later..</Typography>
					</Paper>
					<LogOutButton variant="outlined" onClick={logOutFunc}>
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
