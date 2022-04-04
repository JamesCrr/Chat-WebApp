import { styled, Box, Typography, TextField } from "@mui/material";
import { useState } from "react";

const ChatLogContainer = styled(Box)(({ theme }) => ({
	width: "80%",
}));
const ChatLogBox = styled(Box)(({ theme }) => ({
	backgroundColor: "grey",
	height: "90vh",
	overflow: "scroll",
}));
const ChatTextField = styled(TextField)(({ theme }) => ({
	width: "100%",
	"& .MuiOutlinedInput-root": {
		height: "10vh",
	},
}));

const ChatLog = ({ chatLog, submitFieldValueFunc }) => {
	const [fieldValue, setFieldValue] = useState("");

	const onFieldValueChange = (e) => {
		setFieldValue(e.target.value);
	};
	const onFieldSubmit = (e) => {
		e.preventDefault();
		console.log("Submitted:", fieldValue);
		submitFieldValueFunc(fieldValue);
		setFieldValue("");
	};

	const renderChat = (name, text) => {
		return (
			<Box key={Math.random()}>
				<Typography variant="h5">{name}:</Typography>
				<Typography variant="h6">{text}</Typography>
			</Box>
		);
	};

	return (
		<ChatLogContainer>
			<ChatLogBox>{chatLog.map((chatObject) => renderChat(chatObject.sender, chatObject.content))}</ChatLogBox>
			<form onSubmit={onFieldSubmit}>
				<ChatTextField onChange={onFieldValueChange} value={fieldValue} variant="outlined" />
			</form>
		</ChatLogContainer>
	);
};

export default ChatLog;
