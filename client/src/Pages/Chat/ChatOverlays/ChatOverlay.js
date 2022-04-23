import { createContext } from "react";
import { Box, Fade, useTheme } from "@mui/material";
import { OverlayBox, ParentContentPaper, CloseOverlayButton } from "./ChatOverlayStyles";
import ChatOverlayNewRoom from "./ChatOverlayNewRoom";
import ChatOverlayRoomDetails from "./ChatOverlayRoomDetails";

export const OverlayContext = createContext();
const ChatOverlay = ({
	renderOverlay,
	overlayDetails,
	closeOverlayFunc,
	createNewRoomFunc,
	deleteRoomFunc,
	leaveRoomFunc,
	handleLogoutFunc,
	currentUsername,
	currentRoomObj,
	connectedUsersMap,
	isRoomOwner,
}) => {
	const theme = useTheme();
	// Close overlay when clicking background
	const overlayBackgroundClicked = () => closeOverlayFunc();
	// Stop parent event from firing that closes overlay
	const overlayContentClicked = (e) => e.stopPropagation();

	/**
	 * Returns the overlay the user clicks on
	 * @returns Component that corresponse to the correct overlay
	 */
	const whichOverlayToRender = () => {
		const componentProps = {
			overlayDetails,
			deleteThisRoomFunc: () => deleteRoomFunc(currentRoomObj.name),
			leaveThisRoomFunc: () => leaveRoomFunc(currentRoomObj.name),
			createNewRoomFunc,
			handleLogoutFunc,
		};
		if (overlayDetails.newRoom) return <ChatOverlayNewRoom {...componentProps} />;
		else if (overlayDetails.roomDetails)
			return <ChatOverlayRoomDetails {...{ ...componentProps, connectedUsersMap, currentUsername, currentRoomObj, isRoomOwner }} />;
		else return <ChatOverlayNewRoom {...componentProps} />;
	};

	return (
		<Fade in={renderOverlay} timeout={250}>
			<OverlayBox onClick={overlayBackgroundClicked}>
				<ParentContentPaper elevation={6} newRoom={overlayDetails.newRoom} onClick={overlayContentClicked}>
					<Box sx={{ height: "5%", paddingTop: "10px", paddingRight: "10px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
						<CloseOverlayButton onClick={overlayBackgroundClicked}>
							<svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
								<path
									fill={theme.palette.error.dark}
									d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z"
								/>
							</svg>
						</CloseOverlayButton>
					</Box>
					<OverlayContext.Provider value={{ overlayDetails }}>{whichOverlayToRender()}</OverlayContext.Provider>
				</ParentContentPaper>
			</OverlayBox>
		</Fade>
	);
};

export default ChatOverlay;
