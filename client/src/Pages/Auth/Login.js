import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Container, TextField, Typography } from "@mui/material";
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
import { Link } from "react-router-dom";
import AppearanceToggleBar from "./AppearanceToggleBar";

// [TODO]:
// Have loading animation for Heroku Startup timing, gonna take awhile
const Login = ({ LoginUser }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// Server related
	const [errorMessage, setErrorMessage] = useState("");
	const [waitingForServer, setWaitingForServer] = useState(false);

	const onEmailChange = (e) => setEmail(e.target.value);
	const onPasswordChange = (e) => setPassword(e.target.value);
	const handleLogin = async () => {
		// [TODO]:
		// Validate data bfr sending..
		try {
			const res = await fetch("http://localhost:5000/auth/login", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			if (res.status === 404) throw new Error("Unable to reach Server, Try again later!");
			const resJSON = await res.json();
			if (resJSON.errorCode) throw new Error(resJSON.message);
			const { username, _dbId, token } = resJSON;
			ReactDOM.unstable_batchedUpdates(() => {
				// Login with credentials received
				LoginUser(username, _dbId, token);
				setWaitingForServer(false);
			});
		} catch (error) {
			console.log(error);
			ReactDOM.unstable_batchedUpdates(() => {
				setErrorMessage(error.message);
				setWaitingForServer(false);
			});
		}
	};
	const onSubmitButtonPressed = () => {
		if (!email || !password || waitingForServer) return false;
		// Wait for server responses
		setWaitingForServer(true);
		// Send login info to server
		handleLogin();
	};

	return (
		<PageBackgroundPaper>
			<Container sx={{ background: "none" }}>
				<AppearanceToggleBar />
				<ContentBox>
					<ContentPaper elevation={12}>
						<PageTitle variant="h2">Login</PageTitle>
						<Typography color={(theme) => theme.palette.text.secondary} variant="h6">
							Email
						</Typography>
						<TextField onChange={onEmailChange} value={email} variant="outlined" />
						<Typography color={(theme) => theme.palette.text.secondary} sx={{ marginTop: "10px" }} variant="h6">
							Password
						</Typography>
						<TextField onChange={onPasswordChange} value={password} variant="outlined" />
						<ErrorMessagePaper errorActive={errorMessage === "" ? false : true}>{errorMessage}&nbsp;</ErrorMessagePaper>
						<form onSubmit={onSubmitButtonPressed}>
							<ButtonBox>
								<SubmitButton loading={waitingForServer} variant="contained" onClick={onSubmitButtonPressed}>
									Login
								</SubmitButton>
							</ButtonBox>
						</form>
						<Typography sx={{ display: "inline" }} variant="p">
							<Link style={{ textDecoration: "none" }} to="/register">
								<AlternativeOptionTraverseLink variant="subtitle2">Register Instead</AlternativeOptionTraverseLink>
							</Link>
						</Typography>
					</ContentPaper>
				</ContentBox>
			</Container>
		</PageBackgroundPaper>
	);
};

export default Login;
