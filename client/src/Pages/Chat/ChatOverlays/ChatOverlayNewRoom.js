import { useState } from "react";
import { AddNewRoomContentBox, AddNewRoomButton, ErrorTypography } from "./ChatOverlayStyles";
import { Box, Typography, TextField, Button, Fade } from "@mui/material";

const ChatOverlayNewRoom = ({ overlayDetails, createNewRoomFunc }) => {
	const [newRoomName, setNewRoomName] = useState("");
	/**
	 * Textfield for new room changes
	 * @param {Object} event
	 */
	const onNewRoomNameFieldChange = (e) => setNewRoomName(e.target.value);
	const onNewRoomNameFieldSubmit = (e) => {
		e.preventDefault();
		// [TODO]: Validate Input here
		// ...
		if (newRoomName === "") return;
		createNewRoomFunc(newRoomName);
		setNewRoomName("");
	};

	return (
		<AddNewRoomContentBox>
			<Typography variant="h4">Join / Create New Room</Typography>
			<form style={{ width: "80%" }} onSubmit={onNewRoomNameFieldSubmit}>
				<TextField sx={{ marginTop: "10%", width: "100%" }} value={newRoomName} onChange={onNewRoomNameFieldChange} variant="outlined" />
				<Box sx={{ marginTop: "2%", width: "100%" }}>
					{overlayDetails.error ? (
						<Fade in={overlayDetails.error} timeout={150}>
							<ErrorTypography variant="h6">{overlayDetails.errorMessage ? overlayDetails.errorMessage : "Error, try again later!"}</ErrorTypography>
						</Fade>
					) : (
						<ErrorTypography variant="h6">&nbsp;&nbsp;</ErrorTypography>
					)}
				</Box>
			</form>
			<AddNewRoomButton variant="contained" onClick={onNewRoomNameFieldSubmit}>
				<Typography variant="button">Add</Typography>
			</AddNewRoomButton>
		</AddNewRoomContentBox>
	);
};

export default ChatOverlayNewRoom;
