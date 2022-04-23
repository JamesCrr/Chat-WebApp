import { useContext } from "react";
import { materialContext } from "../../App";
import { Paper, styled, useTheme } from "@mui/material";
import DarkLightIconButton from "../DarkLightIconButton";

const ToggleBarContainer = styled(Paper)(({ theme }) => ({
	boxSizing: "border-box",
	height: "5vh",
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
	paddingTop: "20px",
	paddingBottom: "0px",

	boxShadow: "none",
	borderRadius: "0px",
	background: "none",
}));

const AppearanceToggleBar = () => {
	const theme = useTheme();
	const { setAppearanceToDark } = useContext(materialContext);

	return (
		<ToggleBarContainer>
			<DarkLightIconButton onClickFunction={() => setAppearanceToDark(theme.palette.mode === "light" ? true : false)} />
		</ToggleBarContainer>
	);
};

export default AppearanceToggleBar;
