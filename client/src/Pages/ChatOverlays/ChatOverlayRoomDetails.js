import { useContext, useState } from "react";
import { Box, Button, Container, Switch, Typography, useTheme } from "@mui/material";
import {
	RoomDetailsContentBox,
	RoomDetailsDangerZone,
	AppearanceSettings,
	RoomDetailDangerProperty,
	RoomDetailsDangerButton,
} from "./ChatOverlayStyles";
import { materialContext } from "../../App";

const ChatOverlayRoomDetails = ({ overlayDetails, ownDeleteRoomFunc, ownLeaveRoomFunc, handleLogout }) => {
	const { setAppearanceToDark } = useContext(materialContext);
	const theme = useTheme();
	const [darkMode, setDarkMode] = useState(theme.palette.mode === "dark" ? true : false);

	const onAppearanceSwitchChanged = (e) => {
		// Swap the appearance
		const newDarkMode = theme.palette.mode === "dark" ? false : true;
		setAppearanceToDark(newDarkMode);
		setDarkMode(newDarkMode);
	};

	return (
		<>
			<Typography sx={{ height: "10%", paddingBottom: "2%" }} variant="h3">
				Settings
			</Typography>
			<RoomDetailsContentBox>
				<AppearanceSettings elevation={3}>
					<Box sx={{ display: "inline" }}>
						<Typography variant="h5">Appearance</Typography>
						<Typography variant="subtitle2">Dark Mode</Typography>
					</Box>
					<Switch checked={darkMode} onChange={onAppearanceSwitchChanged} />
				</AppearanceSettings>
				<RoomDetailsDangerZone elevation={3}>
					<RoomDetailDangerProperty variant="outlined" square>
						<Box sx={{ display: "inline-block" }}>
							<Typography variant="h5">Leave Room</Typography>
							<Typography variant="subtitle2">Leaving, but you can always return</Typography>
						</Box>
						<RoomDetailsDangerButton color="error" variant="outlined" onClick={ownLeaveRoomFunc}>
							Leave Room
						</RoomDetailsDangerButton>
					</RoomDetailDangerProperty>
					<RoomDetailDangerProperty variant="outlined" square>
						<Box sx={{ display: "inline-block" }}>
							<Typography variant="h5">Delete Room</Typography>
							<Typography variant="subtitle2">Kick everyone out and say goodbye!</Typography>
						</Box>
						<RoomDetailsDangerButton color="error" variant="outlined" onClick={ownDeleteRoomFunc}>
							Delete Room
						</RoomDetailsDangerButton>
					</RoomDetailDangerProperty>
				</RoomDetailsDangerZone>
				<Button sx={{ marginTop: "4%", marginBottom: "2%" }} variant="contained" color="error" onClick={handleLogout}>
					Log Out
				</Button>
			</RoomDetailsContentBox>
		</>
	);
};

export default ChatOverlayRoomDetails;
