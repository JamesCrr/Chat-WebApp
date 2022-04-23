import { useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import {
	RoomDetailsContentBox,
	RoomDetailsDangerZone,
	MembersContainer,
	MembersTitleContainer,
	MembersListParent,
	MembersItem,
	RoomDetailDangerProperty,
	RoomDetailsDangerButton,
	LogoutButton,
} from "./ChatOverlayStyles";

const ChatOverlayRoomDetails = (props) => {
	const [toolTipOpen, setToolTipOpen] = useState(false);
	const toggleToolTip = (e) => setToolTipOpen(!toolTipOpen);

	return (
		<>
			<Typography sx={{ height: "10%" }} variant="h3">
				Settings
			</Typography>
			<RoomDetailsContentBox>
				<MembersContainer>
					<MembersTitleContainer>
						<Typography sx={{ fontWeight: "bold" }} variant="h6">
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
							<Typography sx={{ fontWeight: "bold" }} variant="h6">
								Leave Room
							</Typography>
							<Typography
								color={(theme) => (theme.palette.mode === "dark" ? theme.palette.text.secondary : "rgba(0, 0, 0, 0.8)")}
								variant="subtitle2"
							>
								Leaving, but you can always return
							</Typography>
						</Box>
						<RoomDetailsDangerButton
							variant="contained"
							onClick={props.leaveThisRoomFunc}
							disabled={props.currentRoomObj.name === "main" ? true : false}
							loading={props.overlayDetails.waitingForServer}
						>
							Leave
						</RoomDetailsDangerButton>
					</RoomDetailDangerProperty>
					<RoomDetailDangerProperty variant="outlined" square>
						<Box sx={{ display: "inline-block" }}>
							<Typography sx={{ fontWeight: "bold" }} variant="h6">
								Delete Room
							</Typography>
							<Typography
								color={(theme) => (theme.palette.mode === "dark" ? theme.palette.text.secondary : "rgba(0, 0, 0, 0.8)")}
								variant="subtitle2"
							>
								Kick everyone out and say goodbye!
							</Typography>
						</Box>
						<RoomDetailsDangerButton
							variant="contained"
							onClick={props.deleteThisRoomFunc}
							disabled={!props.isRoomOwner}
							loading={props.overlayDetails.waitingForServer}
						>
							Delete
						</RoomDetailsDangerButton>
					</RoomDetailDangerProperty>
				</RoomDetailsDangerZone>
				<LogoutButton variant="contained" onClick={props.handleLogoutFunc}>
					Log Out
				</LogoutButton>
			</RoomDetailsContentBox>
		</>
	);
};

export default ChatOverlayRoomDetails;
