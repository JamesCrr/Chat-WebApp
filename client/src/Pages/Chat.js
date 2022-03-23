import React, { useEffect, useState } from "react";
import useSocketIO from "../SocketIO/useSocketIO";
import { Button, TextField, Typography, Box } from "@mui/material";

const Chat = ({ auth }) => {
	const [socketError, setSocketError] = useState(false);
	const socketInstance = useSocketIO(auth, socketConnectionError);

	/******** Temp ********/
	const [chatLog, setChatLog] = useState([]);
	const [textValue, setTextValue] = useState("");
	/*********************************/

	useEffect(() => {
		return () => socketInstance.disconnectSocket();
	}, []);
	useEffect(() => {
		// TEMP, registering receving message froom socket
		// Rebuild listener function as internal state has changed
		socketInstance.unregisterListener("receivemessage", receivedSocketMessage);
		socketInstance.registerListener("receivemessage", receivedSocketMessage);
		return () => {
			socketInstance.unregisterListener("receivemessage", receivedSocketMessage);
		};
	}, [chatLog]);

	// Hoisted function
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#function_declaration_hoisting
	function socketConnectionError() {
		console.log("Socket Connection Error Callback!");
		setSocketError(true);
	}

	/******** Temp ********/
	const toggleError = () => {
		setSocketError(!socketError);
		socketInstance.changeCurrentRoom("new");
		socketInstance.printSocketRef();
	};
	const onTxtValChange = (e) => {
		setTextValue(e.target.value);
	};
	const onTxtValSubmit = (e) => {
		e.preventDefault();
		console.log("submiting", textValue);
		socketInstance.emitMessage(textValue);
		setTextValue("");
	};
	const receivedSocketMessage = (payload) => {
		const { username, message } = payload;
		console.log("recevied mesage", payload);

		const tempChatLog = chatLog.slice();
		tempChatLog.push({ username, message });
		setChatLog(tempChatLog);
	};
	/*********************************/

	return (
		<div>
			{auth.isUserLoggedIn() && (
				<Button onClick={auth.handleLogout} variant="outlined">
					Log out
				</Button>
			)}
			<form>
				<Button onClick={toggleError} variant="outlined">
					SWICH STATETE
				</Button>
			</form>

			<form onSubmit={onTxtValSubmit}>
				{chatLog.map((singleChatBubble) => {
					return (
						<Box key={Math.random()}>
							<Typography variant="h5">{singleChatBubble.username}:</Typography>
							<Typography variant="h6">{singleChatBubble.message}</Typography>
						</Box>
					);
				})}
				<TextField onChange={onTxtValChange} value={textValue} variant="outlined" />
			</form>

			<h2>Chat</h2>
			<h2>Chat</h2>
		</div>
	);
};

export default Chat;
