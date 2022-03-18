import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography } from "@mui/material";

const Register = ({ handleRegister }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const routerDOMNavigate = useNavigate();

	const onNameChange = (e) => {
		setName(e.target.value);
	};
	const onEmailChange = (e) => {
		setEmail(e.target.value);
	};
	const onPasswordChange = (e) => {
		setPassword(e.target.value);
	};
	const onSubmitButton = (e) => {
		e.preventDefault();
		handleRegister(email, password);
		routerDOMNavigate("/login", { replace: true });
	};

	return (
		<Container>
			<h1>Register</h1>
			<Typography variant="h6">Name</Typography>
			<TextField onChange={onNameChange} value={name} variant="outlined" />
			<Typography variant="h6">Email</Typography>
			<TextField onChange={onEmailChange} value={email} variant="outlined" />
			<Typography variant="h6">Password</Typography>
			<TextField onChange={onPasswordChange} value={password} variant="outlined" />

			<form onSubmit={onSubmitButton}>
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
