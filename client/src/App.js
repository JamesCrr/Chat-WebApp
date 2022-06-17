import React, { createContext, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Chat, NotFound, Register } from "./Pages/index";
import ProtectedRoute from "./Auth/ProtectedRoute";
import useAuthHelper from "./Auth/useAuthHelper";
import { ThemeProvider } from "@mui/material/";
import getMaterialTheme from "./MUI/ThemeGenerator";

export const materialContext = createContext();

const App = () => {
	const authUser = useAuthHelper();
	const [darkMode, setDarkMode] = useState(false);

	/**
	 * Generates new customTheme based on darkMode, sets State
	 * @param {Boolean} darkMode True=Dark, False=Light
	 */
	const setAppearanceToDark = (darkMode) => setDarkMode(darkMode);

	/**
	 * Wrapper function for generating a new theme
	 * @returns Theme Object
	 */
	const getNewTheme = useMemo(() => {
		return getMaterialTheme(darkMode);
	}, [darkMode]);

	return (
		<>
			<ThemeProvider theme={getNewTheme}>
				<materialContext.Provider value={{ setAppearanceToDark }}>
					<Routes>
						<Route path="/" element={<Navigate to="/login" replace />} />
						<Route path="register" element={<Register />} />
						<Route path="login" element={authUser.isUserLoggedIn() ? <Navigate to="/chat" replace /> : <Login LoginUser={authUser.handleLogin} />} />
						<Route element={<ProtectedRoute user={authUser.isUserLoggedIn()} />}>
							<Route path="chat" element={<Chat authUser={authUser} />} />
						</Route>
						{/* <Route path="*" element={<NotFound />} /> */}
						<Route path="/" element={<Navigate to="/login" replace />} />
					</Routes>
				</materialContext.Provider>
			</ThemeProvider>
		</>
	);
};

export default App;
