import { styled, Box, Typography, TextField } from "@mui/material";
import { useEffect, useState } from "react";

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

const ChatLog = ({ registerListener, unregisterListener, submitFieldValueFunc, currentRoom }) => {
	const [chatLog, setChatLog] = useState([]);
	const [fieldValue, setFieldValue] = useState("");

	useEffect(() => {
		// Reregister listener func everytime rerender
		registerListener("receivemessage", onMessageReceived);
		return () => {
			unregisterListener("receivemessage", onMessageReceived);
		};
	}, [registerListener, unregisterListener, chatLog]);
	useEffect(() => {
		/**
		 * FETCH CHAT HISTORY FROM DB, but now no DB so just clearing it
		 */
		console.log("CHANGING ROOM, Clearinfg chat");
		setChatLog([]);
	}, [currentRoom]);

	const onFieldValueChange = (e) => {
		setFieldValue(e.target.value);
	};
	const onFieldSubmit = (e) => {
		e.preventDefault();
		console.log("Submitted:", fieldValue);
		submitFieldValueFunc(fieldValue);
		setFieldValue("");
	};
	const onMessageReceived = (payload) => {
		const { username, message } = payload;
		console.log("recevied mesage", payload);
		const tempChatLog = chatLog.slice();
		tempChatLog.push({ username, message });
		setChatLog(tempChatLog);
	};

	const renderChat = (username, text) => {
		return (
			<Box key={Math.random()}>
				<Typography variant="h5">{username}:</Typography>
				<Typography variant="h6">{text}</Typography>
			</Box>
		);
	};

	return (
		<ChatLogContainer>
			<ChatLogBox>{chatLog.map((chatObject) => renderChat(chatObject.username, chatObject.message))}</ChatLogBox>
			<form onSubmit={onFieldSubmit}>
				<ChatTextField onChange={onFieldValueChange} value={fieldValue} variant="outlined" />
			</form>
		</ChatLogContainer>
	);
};

export default ChatLog;
