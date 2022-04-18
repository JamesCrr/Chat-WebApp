import { useContext } from "react";
import { materialContext } from "../../App";
import { Paper, styled, useTheme } from "@mui/material";
import DarkLightIconButton from "../DarkLightIconButton";

const ToggleBarContainer = styled(Paper)(({ theme }) => ({
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
	paddingTop: "10px",

	boxShadow: "none",
	borderRadius: "0px",
	background: theme.palette.background.default,
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
