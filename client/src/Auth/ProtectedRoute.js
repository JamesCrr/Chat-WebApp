import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
	return (
		<div>
			{user ? children : <Navigate to="/login" replace />}
			<Outlet />
		</div>
	);
};

export default ProtectedRoute;
