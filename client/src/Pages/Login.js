import React, { useState } from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Login = ({ handleLogin }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onEmailChange = (e) => {
		setEmail(e.target.value);
	};
	const onPasswordChange = (e) => {
		setPassword(e.target.value);
	};
	const onSubmitButton = () => {
		console.log("Loggin in!", email, password);
		handleLogin(email, password);
	};

	return (
		<Container>
			<h1>Login</h1>
			<Typography variant="h6">Email</Typography>
			<TextField onChange={onEmailChange} value={email} variant="outlined" />
			<Typography variant="h6">Password</Typography>
			<TextField onChange={onPasswordChange} value={password} variant="outlined" />
			<form onSubmit={onSubmitButton}>
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
