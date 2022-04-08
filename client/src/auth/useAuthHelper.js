import { useEffect, useState } from "react";

const ssjwt = "chatjwt";
const ssdbid = "chatdbid";
const ssusername = "chatusername";
const useAuthHelper = () => {
	const [username, setUsername] = useState(null);
	const [_dbId, setDbId] = useState(null);
	const [jwt, setJwt] = useState(null);

	useEffect(() => {
		setJwt(sessionStorage.getItem(ssjwt));
		setDbId(sessionStorage.getItem(ssdbid));
		setUsername(sessionStorage.getItem(ssusername));
	}, []);

	const handleLogin = (username, _dbId, jwt) => {
		setUsername(username);
		setDbId(_dbId);
		setJwt(jwt);
		sessionStorage.setItem(ssjwt, jwt);
		sessionStorage.setItem(ssdbid, _dbId);
		sessionStorage.setItem(ssusername, username);
	};
	const handleLogout = () => {
		setUsername(null);
		setDbId(null);
		setJwt(null);
		sessionStorage.removeItem(ssjwt);
		sessionStorage.removeItem(ssdbid);
		sessionStorage.removeItem(ssusername);
	};

	const getUsername = () => username;
	const getJWT = () => jwt;
	const getDBID = () => _dbId;
	const isUserLoggedIn = () => (jwt ? true : false);

	return { handleLogin, handleLogout, getUsername, getJWT, getDBID, isUserLoggedIn };
};

export default useAuthHelper;
