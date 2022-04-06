import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Chat, NotFound, Store, Navbar, Register } from "./Pages/index";
import ProtectedRoute from "./Auth/ProtectedRoute";
import useAuthHelper from "./Auth/useAuthHelper";
import { ThemeProvider } from "@mui/material/";
import getMaterialTheme from "./MUI/ThemeGenerator";

const customTheme = getMaterialTheme("light");

const App = () => {
	const authUser = useAuthHelper();
	return (
		<>
			<ThemeProvider theme={customTheme}>
				<Routes>
					<Route path="/" element={<Navigate to="/login" replace />} />
					<Route path="register" element={<Register />} />
					<Route path="login" element={authUser.isUserLoggedIn() ? <Navigate to="/chat" replace /> : <Login LoginUser={authUser.handleLogin} />} />
					<Route element={<ProtectedRoute user={authUser.isUserLoggedIn()} />}>
						<Route path="chat" element={<Chat authUser={authUser} />} />
						<Route path="store" element={<Store />} />
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</ThemeProvider>
		</>
	);
};

export default App;
