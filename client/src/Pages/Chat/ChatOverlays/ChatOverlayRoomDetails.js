import { useState } from "react";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import {
	RoomDetailsContentBox,
	RoomDetailsDangerZone,
	MembersContainer,
	MembersTitleContainer,
	MembersListParent,
	MembersItem,
	RoomDetailDangerProperty,
	RoomDetailsDangerButton,
} from "./ChatOverlayStyles";

const ChatOverlayRoomDetails = (props) => {
	const [toolTipOpen, setToolTipOpen] = useState(false);
	const toggleToolTip = (e) => setToolTipOpen(!toolTipOpen);

	return (
		<>
			<Typography sx={{ height: "10%", paddingBottom: "2%" }} variant="h3">
				Settings
			</Typography>
			<RoomDetailsContentBox>
				<MembersContainer>
					<MembersTitleContainer>
						<Typography sx={{ fontWeight: "bold" }} variant="h5">
							Room Members
						</Typography>
					</MembersTitleContainer>
					<MembersListParent direction="column" alignItems="stretch" justifyContent="flex-start" spacing={0.5}>
						{props.currentRoomObj.users.map((username) => {
							return username === props.currentRoomObj.owner ? (
								<MembersItem
									key={username}
									ownself={username === props.currentUsername}
									online={props.connectedUsersMap.has(username)}
									sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}
								>
									<Typography sx={{ marginRight: "1%" }}>{username}</Typography>
									<Tooltip title="Admin" open={toolTipOpen} onClick={toggleToolTip} onClose={toggleToolTip} arrow>
										<svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
											<path
												fill="currentColor"
												d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"
											/>
										</svg>
									</Tooltip>
								</MembersItem>
							) : (
								<MembersItem key={username} ownself={username === props.currentUsername} online={props.connectedUsersMap.has(username)}>
									{username}
								</MembersItem>
							);
						})}
					</MembersListParent>
				</MembersContainer>
				<RoomDetailsDangerZone elevation={3}>
					<RoomDetailDangerProperty variant="outlined" square>
						<Box sx={{ display: "inline-block" }}>
							<Typography variant="h5">Leave Room</Typography>
							<Typography variant="subtitle2">Leaving, but you can always return</Typography>
						</Box>
						<RoomDetailsDangerButton
							color="error"
							variant="outlined"
							onClick={props.ownLeaveRoomFunc}
							disabled={props.currentRoomObj.name === "main" ? true : false}
						>
							Leave Room
						</RoomDetailsDangerButton>
					</RoomDetailDangerProperty>
					<RoomDetailDangerProperty variant="outlined" square>
						<Box sx={{ display: "inline-block" }}>
							<Typography variant="h5">Delete Room</Typography>
							<Typography variant="subtitle2">Kick everyone out and say goodbye!</Typography>
						</Box>
						<RoomDetailsDangerButton color="error" variant="outlined" onClick={props.ownDeleteRoomFunc} disabled={!props.isRoomOwner}>
							Delete Room
						</RoomDetailsDangerButton>
					</RoomDetailDangerProperty>
				</RoomDetailsDangerZone>
				<Button sx={{ marginTop: "4%", marginBottom: "2%" }} variant="contained" color="error" onClick={props.handleLogoutFunc}>
					Log Out
				</Button>
			</RoomDetailsContentBox>
		</>
	);
};

export default ChatOverlayRoomDetails;
