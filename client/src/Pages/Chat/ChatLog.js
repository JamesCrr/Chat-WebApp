import { useContext, useEffect, useRef, useState } from "react";
import { styled, useTheme, Paper, Divider, Chip, Typography, TextField, IconButton } from "@mui/material";
import { materialContext } from "../../App";
import { OVERLAYTYPES } from "../ChattingApp";
import DarkLightIconButton from "../DarkLightIconButton";
import ChatLogMessage from "./ChatLogMessage";

const ChatRoomLogContainer1 = styled(Paper)(({ theme }) => ({
	height: "100vh",
	borderRadius: "0px",

	[theme.breakpoints.up("xs")]: {
		width: "100%",
	},
	[theme.breakpoints.up("sm")]: {
		width: "80%",
	},
}));
const ChatRoomTitleBar = styled(Paper)(({ theme }) => ({
	height: "10vh",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",

	background: theme.palette.background.paper,
	boxShadow: `0 0 30px 1px black`,
	position: "relative",
}));
const ChatRoomTitleTypography = styled(Typography)(({ theme }) => ({
	fontWeight: "bold",
	marginLeft: "2%",
	overflow: "hidden",
	textOverflow: "ellipsis",
}));
const IconButtonsContainer = styled(Paper)(({ theme }) => ({
	background: "none",
	boxShadow: "none",

	[theme.breakpoints.up("xs")]: {
		padding: "0%",
	},
	[theme.breakpoints.up("sm")]: {
		padding: "0.5%",
	},
}));
const ChatRoomSettingsIconButton = styled(IconButton)(({ theme }) => ({}));
const ChatMessageLog = styled(Paper)(({ theme }) => ({
	height: "80vh",
	overflowY: "scroll",
	background: theme.palette.background.default,
	borderRadius: "0px",

	/* Hide scrollbar for Chrome, Safari and Opera */
	"::-webkit-scrollbar": { display: "none" },
	msOverflowStyle: "none" /* IE and Edge */,
	scrollbarWidth: "none" /* Firefox */,
}));
const ChatTextField = styled(TextField)(({ theme }) => ({
	width: "100%",
	background: theme.palette.background.default,
	transition: `background ${theme.palette.transitionTime}`,
	"& .MuiOutlinedInput-root": {
		height: "10vh",
	},
}));

/**
 * Returns the date's time in 12HR formatted String
 * @param {Date} dateObject
 * @returns String that reprents time in 12HR format
 */
const getAMPMTimeString = (dateObject) => {
	let hours = dateObject.getHours();
	let ampm = hours < 12 ? "am" : "pm";
	hours = hours % 12;
	hours = hours ? hours : "12"; // the hour '0' should be '12'
	let minutes = dateObject.getMinutes();
	let minutesString = minutes < 10 ? "0" + minutes : minutes;
	return hours + ":" + minutes + " " + ampm;
};
/**
 * Returns the month name
 * @param {Number} monthIndex
 * @returns Name of month that correspondes to the index
 */
const getMonthNameString = (monthIndex) => {
	switch (monthIndex) {
		case 0:
			return "January";
		case 1:
			return "February";
		case 2:
			return "March";
		case 3:
			return "April";
		case 4:
			return "May";
		case 5:
			return "June";
		case 6:
			return "July";
		case 7:
			return "August";
		case 8:
			return "September";
		case 9:
			return "October";
		case 10:
			return "November";
		case 11:
		default:
			return "December";
	}
};

const ChatRoomLog = ({ chatLog, selectedRoomObj, openRoomDetailsFunc, submitFieldValueFunc }) => {
	// Input Field
	const [fieldValue, setFieldValue] = useState("");
	// Chatlog
	let chatLogLastDate = null;
	const chatLogEndRef = useRef(); // Scroll to bottom of messages
	// Appearance Settings
	const theme = useTheme();
	const { setAppearanceToDark } = useContext(materialContext);
	const [darkMode, setDarkMode] = useState(theme.palette.mode === "dark" ? true : false);

	// Whenever chatLog changes
	useEffect(() => {
		chatLogEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
	}, [chatLog]);

	/**
	 * Field value changes
	 * @param {Object} e
	 */
	const onFieldValueChange = (e) => {
		setFieldValue(e.target.value);
	};
	const onFieldSubmit = (e) => {
		e.preventDefault();
		console.log("Submitted:", fieldValue);
		submitFieldValueFunc(fieldValue);
		setFieldValue("");
	};

	/**
	 * Appearance Button was pressed
	 */
	const onAppearanceButtonPressed = (e) => {
		// Swap the appearance
		const newDarkMode = theme.palette.mode === "dark" ? false : true;
		setAppearanceToDark(newDarkMode);
		setDarkMode(newDarkMode);
	};

	/**
	 * Helper function to render a single chat message
	 * @param {String} name	Name of user sending the message
	 * @param {String} content Content of message
	 * @param {String} createdDateString Created Date of message in STRING format
	 * @param {String} updatedDateString Updated Date of message in STRING format
	 * @returns Component that renders the message
	 */
	const renderMessage = (name, content, createdDateString, updatedDateString) => {
		const dateObject = new Date(createdDateString);
		const componentKey = name + updatedDateString;
		const messageComponent = <ChatLogMessage key={componentKey} name={name} content={content} timeString={getAMPMTimeString(dateObject)} />;
		// Need insert Date divider bfr rendering message
		const sameDate = chatLogLastDate ? chatLogLastDate.getDate() === dateObject.getDate() : false;
		if (sameDate) {
			const sameMonth = chatLogLastDate ? chatLogLastDate.getMonth() === dateObject.getMonth() : false;
			const sameYear = chatLogLastDate ? chatLogLastDate.getFullYear() === dateObject.getFullYear() : false;
			if (sameMonth && sameYear) return messageComponent;
		}
		// Track latest date
		chatLogLastDate = dateObject;
		return (
			<Paper key={componentKey} sx={{ background: "none", boxShadow: "none", borderRadius: "0px" }}>
				<Divider>
					<Chip
						sx={{
							transition: `background ${theme.palette.transitionTime}, color ${theme.palette.transitionTime}`,
							background: `${theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main}`,
						}}
						label={`${dateObject.getDate()} ${getMonthNameString(dateObject.getMonth())} ${dateObject.getFullYear()}`}
					/>
				</Divider>
				{messageComponent}
			</Paper>
		);
	};

	return (
		<ChatRoomLogContainer1>
			<ChatRoomTitleBar>
				<ChatRoomTitleTypography variant="h4">{selectedRoomObj.name}</ChatRoomTitleTypography>
				<IconButtonsContainer>
					<DarkLightIconButton onClickFunction={onAppearanceButtonPressed} />
					<ChatRoomSettingsIconButton
						disableRipple
						disableTouchRipple
						disableFocusRipple
						onClick={() => openRoomDetailsFunc(OVERLAYTYPES.ROOMDETAILS)}
					>
						<svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
							<path
								style={{ transition: `fill ${theme.palette.transitionTime}` }}
								fill={theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark}
								d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
							/>
						</svg>
					</ChatRoomSettingsIconButton>
				</IconButtonsContainer>
			</ChatRoomTitleBar>
			<ChatMessageLog>
				{chatLog.map((chatObject) =>
					renderMessage(chatObject.sender, chatObject.content, chatObject.createdDateString, chatObject.updatedDateString)
				)}
				<div ref={chatLogEndRef} />
			</ChatMessageLog>
			<form onSubmit={onFieldSubmit}>
				<ChatTextField onChange={onFieldValueChange} value={fieldValue} variant="outlined" />
			</form>
		</ChatRoomLogContainer1>
	);
};

export default ChatRoomLog;
