import { useState } from "react";

const useAuthHelper = () => {
	const [user, setUser] = useState(false);

	const handleRegister = (name, email, password) => {
		console.log("Registering :", name, email, password);
	};
	const handleLogin = (email, password) => {
		console.log("Attempt Log IN:", email, password);
		setUser(true);
	};

	const handleLogout = () => {
		setUser(false);
	};

	return { user, handleRegister, handleLogin, handleLogout };
};

export default useAuthHelper;
