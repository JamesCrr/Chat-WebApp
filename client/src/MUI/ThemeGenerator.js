import { createTheme } from "@mui/material";

/**
 * Generates Palette for Themes, values not filled in will be subbed in by MUI
 * @param {String} mode light or dark
 * @returns Palette Object used to create a Theme
 */
const paletteGenerator = (mode) => {
	return {
		mode,
		...(mode === "light"
			? {
					background: {
						default: "#fff",
						paper: "#d6d6d6",
					},
			  }
			: {
					background: {
						default: "#121212",
						paper: "#121212",
					},
			  }),
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

const getMaterialTheme = (mode = "light") => {
	const themeOptions = {};
	themeOptions.palette = paletteGenerator(mode);
	themeOptions.breakpoints = breakpointsGenerator();
	return createTheme(themeOptions);
};
export default getMaterialTheme;
