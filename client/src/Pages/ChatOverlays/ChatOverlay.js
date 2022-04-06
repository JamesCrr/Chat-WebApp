import { createContext } from "react";
import { Box, Fade } from "@mui/material";
import { OverlayBox, ParentContentBox, CloseOverlayButton } from "./ChatOverlayStyles";
import ChatOverlayNewRoom from "./ChatOverlayNewRoom";
import ChatOverlayRoomDetails from "./ChatOverlayRoomDetails";

export const OverlayContext = createContext();
const ChatOverlay = ({ renderOverlay, overlayDetails, closeOverlayFunc, createNewRoomFunc, handleLogout }) => {
	// Close overlay when clicking background
	const overlayBackgroundClicked = () => closeOverlayFunc();
	// Stop parent event from firing that closes overlay
	const overlayContentClicked = (e) => e.stopPropagation();

	/**
	 * Returns the overlay the user clicks on
	 * @returns Component that corresponse to the correct overlay
	 */
	const whichOverlayToRender = () => {
		if (overlayDetails.newRoom) return <ChatOverlayNewRoom overlayDetails={overlayDetails} createNewRoomFunc={createNewRoomFunc} />;
		else if (overlayDetails.roomDetails) return <ChatOverlayRoomDetails overlayDetails={overlayDetails} handleLogout={handleLogout} />;
		else return <ChatOverlayNewRoom overlayDetails={overlayDetails} createNewRoomFunc={createNewRoomFunc} />;
	};
	/**
	 * Returns different CSS width depending on the current overlay
	 * @returns Overlay CSS width property
	 */
	const getOverlayWidth = () => {
		if (overlayDetails.newRoom) return "40%";
		else if (overlayDetails.roomDetails) return "70%";
		else return "40%";
	};
	/**
	 * Returns different CSS height depending on the current overlay
	 * @returns Overlay CSS height property
	 */
	const getOverlayHeight = () => {
		if (overlayDetails.newRoom) return "70%";
		else if (overlayDetails.roomDetails) return "70%";
		else return "70%";
	};

	return (
		<Fade in={renderOverlay} timeout={250}>
			<OverlayBox onClick={overlayBackgroundClicked}>
				<ParentContentBox ownWidth={getOverlayWidth()} ownHeight={getOverlayHeight()} onClick={overlayContentClicked}>
					<Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "2%", marginRight: "2%" }}>
						<CloseOverlayButton onClick={overlayBackgroundClicked}>
							<svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
								<path fill="red" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
							</svg>
						</CloseOverlayButton>
					</Box>
					<OverlayContext.Provider value={{ overlayDetails }}>{whichOverlayToRender()}</OverlayContext.Provider>
				</ParentContentBox>
			</OverlayBox>
		</Fade>
	);
};

export default ChatOverlay;
