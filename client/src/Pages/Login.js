import React, { useState } from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Login = ({ LoginUser }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onEmailChange = (e) => {
		setEmail(e.target.value);
	};
	const onPasswordChange = (e) => {
		setPassword(e.target.value);
	};
	const handleLogin = async () => {
		try {
			const res = await fetch("http://localhost:5000/auth/login", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			// [TODO]:
			// Throw a different status for our own errors
			if (res.status === 404) throw new Error("Unable to login");
			const data = await res.json();
			const { username, token } = data;
			LoginUser(username, token);
		} catch (error) {
			console.log(error);
		}
	};
	const onSubmitButton = () => {
		if (!email || !password) return false;
		// Send login info to server
		handleLogin();
	};

	return (
		<Container>
			<h1>Login</h1>
			<Typography variant="h6">Email</Typography>
			<TextField onChange={onEmailChange} value={email} variant="outlined" />
			<Typography variant="h6">Password</Typography>
			<TextField onChange={onPasswordChange} value={password} variant="outlined" />
			<form>
				<Button variant="outlined" onClick={onSubmitButton}>
					Login
				</Button>
			</form>
			<Typography variant="p">
				<Link to="/register">Register Instead</Link>
			</Typography>
		</Container>
	);
};

export default Login;
