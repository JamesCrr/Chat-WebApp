import { useState } from "react";

const useAuthHelper = () => {
	const [user, setUser] = useState(false);

	const handleLogin = (username, jwtToken) => {
		console.log("Logging In:", username, jwtToken);
		setUser(true);
	};
	const handleLogout = () => {
		setUser(false);
	};

	return { user, handleLogin, handleLogout };
};

export default useAuthHelper;
