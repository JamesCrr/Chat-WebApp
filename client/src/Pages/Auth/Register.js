import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
	PageBackgroundPaper,
	ContentBox,
	ContentPaper,
	PageTitle,
	ErrorMessagePaper,
	ButtonBox,
	SubmitButton,
	AlternativeOptionTraverseLink,
} from "./AuthStyles";
import { Container, TextField, Typography } from "@mui/material";
import AppearanceToggleBar from "./AppearanceToggleBar";

// [TODO]:
// Have loading animation for Heroku Startup timing, gonna take awhile
const Register = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// Server related
	const [errorMessage, setErrorMessage] = useState("");
	const [waitingForServer, setWaitingForServer] = useState(false);
	const routerDOMNavigate = useNavigate();

	const onUsernameChange = (e) => setUsername(e.target.value);
	const onEmailChange = (e) => setEmail(e.target.value);
	const onPasswordChange = (e) => setPassword(e.target.value);
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
			if (resJSON.errorCode) throw new Error(resJSON.message);
			console.log(resJSON);
			// Register success, go to login page
			routerDOMNavigate("/login", { replace: true });
		} catch (error) {
			console.log(error);
			// Batch state updates in async func
			ReactDOM.unstable_batchedUpdates(() => {
				setErrorMessage(error.message);
				setWaitingForServer(false);
			});
		}
	};
	const onSubmitButtonPressed = () => {
		// [TODO]:
		// validate values bfr submitting
		if (!username || !email || !password) return false;
		// Send Register Info to server
		setWaitingForServer(true);
		handleRegistering();
	};

	return (
		<PageBackgroundPaper>
			<Container sx={{ background: "none" }}>
				<AppearanceToggleBar />
				<ContentBox>
					<ContentPaper elevation={12}>
						<PageTitle variant="h2">Register</PageTitle>
						<Typography color={(theme) => theme.palette.text.secondary} variant="h6">
							Username
						</Typography>
						<TextField onChange={onUsernameChange} value={username} variant="outlined" />
						<Typography color={(theme) => theme.palette.text.secondary} variant="h6">
							Email
						</Typography>
						<TextField onChange={onEmailChange} value={email} variant="outlined" />
						<Typography color={(theme) => theme.palette.text.secondary} variant="h6">
							Password
						</Typography>
						<TextField onChange={onPasswordChange} value={password} variant="outlined" />
						<ErrorMessagePaper errorActive={errorMessage === "" ? false : true}>{errorMessage}&nbsp;</ErrorMessagePaper>
						<form onSubmit={onSubmitButtonPressed}>
							<ButtonBox>
								<SubmitButton loading={waitingForServer} variant="contained" onClick={onSubmitButtonPressed}>
									Register
								</SubmitButton>
							</ButtonBox>
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
