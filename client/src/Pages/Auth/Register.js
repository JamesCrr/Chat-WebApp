import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageBackgroundPaper, ContentBox, ContentPaper, PageTitle, ButtonPaper, SubmitButton, AlternativeOptionTraverseLink } from "./AuthStyles";
import { Container, TextField, Typography } from "@mui/material";
import AppearanceToggleBar from "./AppearanceToggleBar";

// [TODO]:
// Have loading animation for Heroku Startup timing, gonna take awhile
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
		// [TODO]:
		// Validate data bfr sending..
		// username cannot be server!!
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
			const resJSON = await res.json();
			if (resJSON.errorCode) throw new Error("Unable to register");
			console.log(resJSON);
			// [TODO]:
			// Check for SERVER Error flag, Render error message or smth
			// ...
		} catch (error) {
			// [TODO]:
			// Display errors to user instead of console logging
			console.log(error);
			return;
		}
		// Register success, go to login page
		routerDOMNavigate("/login", { replace: true });
	};
	const onSubmitButtonPressed = () => {
		// [TODO]:
		// Check for values bfr submitting
		if (!username || !email || !password) return false;
		// Send Register Info to server
		handleRegistering();
	};

	return (
		<PageBackgroundPaper>
			<Container sx={{ background: "none" }}>
				<AppearanceToggleBar />
				<ContentBox>
					<ContentPaper elevation={12}>
						<PageTitle variant="h2">Register</PageTitle>
						<Typography variant="h6">Username</Typography>
						<TextField onChange={onUsernameChange} value={username} variant="outlined" />
						<Typography variant="h6">Email</Typography>
						<TextField onChange={onEmailChange} value={email} variant="outlined" />
						<Typography variant="h6">Password</Typography>
						<TextField onChange={onPasswordChange} value={password} variant="outlined" />
						<form onSubmit={onSubmitButtonPressed}>
							<ButtonPaper>
								<SubmitButton variant="contained" onClick={onSubmitButtonPressed}>
									<Typography variant="p">Register</Typography>
								</SubmitButton>
							</ButtonPaper>
						</form>
						<Typography sx={{ display: "inline" }} variant="p">
							<Link style={{ textDecoration: "none" }} to="/login">
								<AlternativeOptionTraverseLink variant="subtitle2">Login Instead</AlternativeOptionTraverseLink>
							</Link>
						</Typography>
					</ContentPaper>
				</ContentBox>
			</Container>
		</PageBackgroundPaper>
	);
};

export default Register;
