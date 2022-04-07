import { createTheme } from "@mui/material";

const darkModeTransTime = "0.3s";
const backgroundDefault_light = "#fff";
const backgroundPaper_light = "#d6d6d6";
const backgroundDefault_dark = "#121212";
const backgroundPaper_dark = "#121212";

/**
 * Generates Palette for Themes, values not filled in will be subbed in by MUI
 * @param {String} paletteMode light or dark
 * @returns Palette Object used to create a Theme
 */
const paletteGenerator = (paletteMode) => {
	return {
		mode: paletteMode,
		transitionTime: darkModeTransTime,
		...(paletteMode === "light"
			? {
					background: {
						default: backgroundDefault_light,
						paper: backgroundPaper_light,
					},
			  }
			: {
					background: {
						default: backgroundDefault_dark,
						paper: backgroundPaper_dark,
					},
			  }),
	};
};
const componentsGenerator = (darkMode) => {
	return {
		MuiTypography: {
			styleOverrides: {
				root: {
					color: darkMode ? "#fff" : "rgba(0, 0, 0, 0.87)",
					transition: `color ${darkModeTransTime}`,
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					background: darkMode ? backgroundDefault_dark : backgroundDefault_light,
					transition: `background ${darkModeTransTime}`,
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					transition: `background ${darkModeTransTime}`,
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					transition: `background ${darkModeTransTime}`,
				},
			},
		},
	};
};
const breakpointsGenerator = () => {
	return {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1536,
		},
	};
};

const getMaterialTheme = (darkMode) => {
	const themeOptions = {};
	themeOptions.palette = paletteGenerator(darkMode ? "dark" : "light");
	themeOptions.components = componentsGenerator(darkMode);
	themeOptions.breakpoints = breakpointsGenerator();
	return createTheme(themeOptions);
};
export default getMaterialTheme;
