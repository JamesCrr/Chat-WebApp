import { styled, Paper, Typography } from "@mui/material";

const ChatLogMessageContainer = styled(Paper)(({ theme }) => ({
	paddingLeft: "1%",
	paddingRight: "1%",
	background: "none",
	boxShadow: "none",
	borderRadius: "0px",
}));
const MessageContentContainer = styled(Paper)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	background: "none",
	boxShadow: "none",
}));

const ChatLogMessage = ({ name, content, timeString }) => {
	return (
		<ChatLogMessageContainer>
			<Typography variant="h6">{name}:</Typography>
			<MessageContentContainer>
				<Typography variant="h5">{content}</Typography>
				<Typography variant="subtitle2">{timeString}</Typography>
			</MessageContentContainer>
		</ChatLogMessageContainer>
	);
};

export default ChatLogMessage;
