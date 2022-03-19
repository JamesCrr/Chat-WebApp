import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography } from "@mui/material";

const Register = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const routerDOMNavigate = useNavigate();

	const onUsernameChange = (e) => {
		setUsername(e.target.value);
	};
	const onEmailChange = (e) => {
		setEmail(e.target.value);
	};
	const onPasswordChange = (e) => {
		setPassword(e.target.value);
	};
	/**
	 * Fetches Server Response for registering of new user.
	 * Once register succeed, will navigate to login page.
	 * Else,
	 */
	const handleRegistering = async () => {
		try {
			const res = await fetch("http://localhost:5000/auth/register", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({ username, email, password }),
			});
			// [TODO]:
			// Check for other FETCHING Error flags, Render error message or smth..
			if (res.status === 404) throw new Error("Unable to reach Server, Try again later!");
			const data = await res.json();
			console.log(data);
			// [TODO]:
			// Check for SERVER Error flag, Render error message or smth..
		} catch (error) {
			console.log(error);
			return;
		}
		// Register success, go to login page
		routerDOMNavigate("/login", { replace: true });
	};
	const onSubmitButton = () => {
		// [TODO]:
		// Check for values bfr submitting
		if (!username || !email || !password) return false;
		// Send Register Info to server
		handleRegistering();
	};

	return (
		<Container>
			<h1>Register</h1>
			<Typography variant="h6">Username</Typography>
			<TextField onChange={onUsernameChange} value={username} variant="outlined" />
			<Typography variant="h6">Email</Typography>
			<TextField onChange={onEmailChange} value={email} variant="outlined" />
			<Typography variant="h6">Password</Typography>
			<TextField onChange={onPasswordChange} value={password} variant="outlined" />

			<form>
				<Button variant="outlined" onClick={onSubmitButton}>
					Register
				</Button>
			</form>
			<Typography variant="p">
				<Link to="/login">Login Instead</Link>
			</Typography>
		</Container>
	);
};

export default Register;
