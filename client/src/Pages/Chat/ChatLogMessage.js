import { styled, Paper, Typography, Box } from "@mui/material";

const ChatLogMessageContainer = styled(Paper)(({ ownself, theme }) => ({
	paddingLeft: "1%",
	paddingRight: "1%",
	marginBottom: "5px",
	background: "none",
	boxShadow: "none",
	borderRadius: "0px",

	display: "flex",
	justifyContent: ownself ? "flex-end" : "flex-start",
}));
const MessageContentBox1 = styled(Box)(({ ownself, theme }) => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: ownself ? "flex-end" : "flex-start",
	alignItems: ownself ? "flex-end" : "flex-start",
	width: "80%",

	[theme.breakpoints.down("sm")]: {
		width: "100%",
	},
}));
const MessageContentBox2 = styled(Box)(({ ownself, theme }) => ({
	display: "flex",
	justifyContent: "flex-start",
	alignItems: "center",
}));
const SenderTypography = styled(Typography)(({ ownself, theme }) => ({
	fontStyle: "oblique",
	fontWeight: "bold",
	textDecoration: "underline",
	color: ownself ? theme.palette.primary.main : theme.palette.text.primary,
}));
const ContentTypography = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.secondary,
}));
const TimeStringTypography = styled(Typography)(({ theme }) => ({
	marginLeft: "5px",
}));

const ChatLogMessage = ({ ownself, name, content, timeString }) => {
	const ownselfProp = ownself ? 1 : 0;
	return (
		<ChatLogMessageContainer ownself={ownselfProp}>
			<MessageContentBox1 ownself={ownselfProp}>
				<MessageContentBox2 ownself={ownselfProp}>
					<SenderTypography ownself={ownselfProp} variant="h6">
						{name}
					</SenderTypography>
					<TimeStringTypography variant="subtitle2">{timeString}</TimeStringTypography>
				</MessageContentBox2>
				<ContentTypography variant="h5">{content}</ContentTypography>
			</MessageContentBox1>
		</ChatLogMessageContainer>
	);
};

export default ChatLogMessage;
