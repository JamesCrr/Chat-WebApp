import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Store from "./Pages/Store";
import Navbar from "./Pages/Navbar";
import ProtectedRoute from "./auth/ProtectedRoute";
import useAuthHelper from "./auth/useAuthHelper";
import { Button } from "@mui/material";
import Register from "./Pages/Register";

// TESTING SOCKET IO
import { io } from "socket.io-client";
const clientSocket = io("http://localhost:5000");
clientSocket.on("connect_error", (err) => {
	// Unless introduce middlware functions, such as auth functions
	console.log("connect error due to", err.message);
});

const App = () => {
	const auth = useAuthHelper();

	useEffect(() => {
		clientSocket.emit("test", { message: `${clientSocket.id} messaging server` });
	}, [auth.user]);

	return (
		<>
			{auth.user && (
				<>
					<Button onClick={auth.handleLogout} variant="outlined">
						Log out
					</Button>
					<Navbar />
				</>
			)}

			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="register" element={<Register handleRegister={auth.handleRegister} />} />
				<Route path="login" element={auth.user ? <Navigate to="/home" replace /> : <Login handleLogin={auth.handleLogin} />} />
				<Route element={<ProtectedRoute user={auth.user} />}>
					<Route path="home" element={<Home />} />
					<Route path="store" element={<Store />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
};

export default App;
