import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Chat, NotFound, Store, Navbar, Register } from "./Pages/index";
import ProtectedRoute from "./Auth/ProtectedRoute";
import useAuthHelper from "./Auth/useAuthHelper";

const App = () => {
	const auth = useAuthHelper();
	return (
		<>
			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="register" element={<Register />} />
				<Route path="login" element={auth.isUserLoggedIn() ? <Navigate to="/chat" replace /> : <Login LoginUser={auth.handleLogin} />} />
				<Route element={<ProtectedRoute user={auth.isUserLoggedIn()} />}>
					<Route path="chat" element={<Chat auth={auth} />} />
					<Route path="store" element={<Store />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
			<Navbar />
		</>
	);
};

export default App;
