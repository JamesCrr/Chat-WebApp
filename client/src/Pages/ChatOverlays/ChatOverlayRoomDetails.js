import { RoomDetailsContentBox } from "./ChatOverlayStyles";
import { Box, Button, Typography } from "@mui/material";

const ChatOverlayRoomDetails = ({ overlayDetails, handleLogout }) => {
	return (
		<RoomDetailsContentBox>
			<Typography variant="h4">Room Details</Typography>
			<Button variant="contained" color="error" onClick={handleLogout}>
				Log Out
			</Button>
		</RoomDetailsContentBox>
	);
};

export default ChatOverlayRoomDetails;
