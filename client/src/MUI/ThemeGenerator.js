import { createTheme, responsiveFontSizes } from "@mui/material";

const darkModeTransTime = "0.3s";
const backgroundDefault_light = "#fff";
const backgroundPaper_light = "#e3e3e3";
const backgroundPaperer_light = "#929292";

const backgroundDefault_dark = "#121212";
const backgroundPaper_dark = "#212121";
const backgroundPaperer_dark = "#616161";

/**
 * Generates Palette for Themes, values not filled in will be subbed in by MUI
 * @param {String} paletteMode light or dark
 * @returns Palette Object used to create a Theme
 */
const paletteGenerator = (paletteMode) => {
	return {
		mode: paletteMode,
		transitionTime: darkModeTransTime,
		primary: {
			main: "#ffab00",
			light: "#ffdd4b",
			dark: "#c67c00",
			darker: "#af4d00",
		},
		...(paletteMode === "light"
			? {
					background: {
						default: backgroundDefault_light,
						paper: backgroundPaper_light,
						paperer: backgroundPaperer_light,
					},
			  }
			: {
					background: {
						default: backgroundDefault_dark,
						paper: backgroundPaper_dark,
						paperer: backgroundPaperer_dark,
					},
					text: {
						primary: "rgba(240, 240, 240, 0.9)",
						secondary: "rgba(240, 240, 240, 0.7)",
						disabled: "rgba(240, 240, 240, 0.5)",
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
			sm: 500,
			md: 900,
			lg: 1200,
			xl: 1536,
		},
	};
};
const typographyGenerator = (theme) => {
	return {
		...theme.typography,
		h6: {
			...theme.typography.h6,
			[theme.breakpoints.down("sm")]: {
				fontSize: "1rem",
			},
			"@media only screen and (max-width: 600px) ": {},
		},
	};
};

const getMaterialTheme = (darkMode) => {
	const themeOptions = {};
	themeOptions.palette = paletteGenerator(darkMode ? "dark" : "light");
	themeOptions.components = componentsGenerator(darkMode);
	themeOptions.breakpoints = breakpointsGenerator();
	let themeObject = createTheme(themeOptions);
	themeObject = responsiveFontSizes(themeObject); // MUI BuiltIn Responsive font sizes
	themeObject.typography = typographyGenerator(themeObject); // Own values
	return themeObject;
};
export default getMaterialTheme;
