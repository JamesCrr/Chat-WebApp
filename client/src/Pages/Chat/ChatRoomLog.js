import { useContext, useEffect, useRef, useState } from "react";
import { styled, Paper, Typography, TextField, useTheme, IconButton } from "@mui/material";
import { materialContext } from "../../App";
import { OVERLAYTYPES } from "../ChattingApp";

const ChatRoomTitleBar = styled(Paper)(({ theme }) => ({
	height: "10vh",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",

	background: theme.palette.background.paper,
}));
const ChatRoomTitleTypography = styled(Typography)(({ theme }) => ({
	fontWeight: "bold",
	marginLeft: "2%",
}));
const IconButtonsContainer = styled(Paper)(({ theme }) => ({
	background: theme.palette.background.paper,
	padding: "0.5%",
}));
const ChatRoomSettingsIconButton = styled(IconButton)(({ theme }) => ({}));
const ToggleThemeAppearanceIconButton = styled(IconButton)(({ theme }) => ({}));
const ThemeLightIcon = styled("i")(({ theme }) => ({
	transition: "opacity 0.5s, transform 0.5s",
	opacity: theme.palette.mode === "light" ? "1" : "0",
	transform: theme.palette.mode === "light" ? "rotate(0deg) scale(1)" : "rotate(180deg) scale(0.5)",
	position: "absolute",
	display: "block",
}));
const ThemeDarkIcon = styled("i")(({ theme }) => ({
	transition: "opacity 0.5s, transform 0.5s",
	opacity: theme.palette.mode === "dark" ? "1" : "0",
	transform: theme.palette.mode === "dark" ? "rotate(0deg) scale(1)" : "rotate(180deg) scale(0.5)",
	position: "absolute",
	display: "block",
}));
const ChatMessageLog = styled(Paper)(({ theme }) => ({
	height: "80vh",
	overflowY: "scroll",
	background: theme.palette.background.default,

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
const ChatRoomLog = ({ chatLog, selectedRoomObj, openRoomDetailsFunc, submitFieldValueFunc }) => {
	const [fieldValue, setFieldValue] = useState("");
	// Scroll to bottom of messages
	const chatLogEndRef = useRef();
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
		return (
			<Paper key={name + updatedDateString} sx={{ paddingLeft: "1%", paddingRight: "1%", background: "none", boxShadow: "none" }}>
				<Typography variant="h5">{name}:</Typography>
				<Paper sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", boxShadow: "none" }}>
					<Typography variant="h6">{content}</Typography>
					<Typography variant="7">{getAMPMTimeString(dateObject)}</Typography>
				</Paper>
			</Paper>
		);
	};

	return (
		<Paper sx={{ width: "80%", height: "100vh", borderRadius: "0px", background: theme.palette.background.paper }}>
			<ChatRoomTitleBar>
				<ChatRoomTitleTypography variant="h4">{selectedRoomObj.name}</ChatRoomTitleTypography>
				<IconButtonsContainer>
					<ToggleThemeAppearanceIconButton onClick={onAppearanceButtonPressed}>
						<Paper sx={{ width: "24px", height: "24px", boxShadow: "none", background: "none" }}>
							<ThemeLightIcon>
								<svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
									<path
										fill={theme.palette.text.secondary}
										d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z"
									/>
								</svg>
							</ThemeLightIcon>
							<ThemeDarkIcon>
								<svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
									<path
										fill={theme.palette.text.secondary}
										d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z"
									/>
								</svg>
							</ThemeDarkIcon>
						</Paper>
					</ToggleThemeAppearanceIconButton>
					<ChatRoomSettingsIconButton onClick={() => openRoomDetailsFunc(OVERLAYTYPES.ROOMDETAILS)}>
						<svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
							<path
								fill={theme.palette.text.secondary}
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
		</Paper>
	);
};

export default ChatRoomLog;
