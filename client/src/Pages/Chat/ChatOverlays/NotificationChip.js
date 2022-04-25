import { styled, Chip, Box } from "@mui/material";

const ChipBox = styled(Box, { shouldForwardProp: (prop) => prop !== "chipDetails" })(({ chipDetails, theme }) => ({
	boxSizing: "border-box",
	zIndex: "9",
	position: "absolute",
	background: "none",
	width: "100vw",
	bottom: "14vh",

	display: "flex",
	justifyContent: "center",
}));
const Chip1 = styled(Chip, { shouldForwardProp: (prop) => prop !== "chipDetails" })(({ chipDetails, theme }) => ({
	transition: `opacity 0.4s, transform 0.4s, background ${theme.palette.transitionTime}, color ${theme.palette.transitionTime}`,
	background: theme.palette.mode === "dark" ? theme.palette.error.dark : theme.palette.error.main,
	opacity: chipDetails.active ? "1" : "0",
	color: theme.palette.text.secondary,
	transform: chipDetails.active ? "translateY(-20px)" : "none",
	padding: "15px 0px",
	fontSize: "1.5rem",

	"& .MuiChip-deleteIcon": {
		marginLeft: "5px",
		transition: `color ${theme.palette.transitionTime}`,
		color: theme.palette.primary.main,
		fontSize: "30px",

		"&:hover": {
			color: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.dark,
		},
	},

	[theme.breakpoints.down("sm")]: {
		fontSize: "1.2rem",
		position: "relative",
		padding: "2px 0px",
		height: "auto",

		"& .MuiChip-label": {
			position: "relative",
			whiteSpace: "normal",
			overflow: "visible",
			textOverflow: "clip",
		},

		"& .MuiChip-deleteIcon": {
			fontSize: "28px",
		},
	},
}));

const NotificationChip = ({ chipDetails, removeChipFunc }) => {
	const onRemoveChip = (e) => removeChipFunc();

	return (
		<ChipBox chipDetails={chipDetails}>
			<Chip1 chipDetails={chipDetails} label={chipDetails.message} onDelete={onRemoveChip}></Chip1>;
		</ChipBox>
	);
};

export default NotificationChip;
