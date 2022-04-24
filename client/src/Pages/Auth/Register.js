import React, { useState } from "react";
import ReactDOM from "react-dom";
import validator from "validator";
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

const Register = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [inputErrors, setInputErrors] = useState({ username: false, email: false, password: false });
	// Server related
	const [errorMessage, setErrorMessage] = useState("");
	const [waitingForServer, setWaitingForServer] = useState(false);
	const routerDOMNavigate = useNavigate();

	const onUsernameChange = (e) => {
		// Max length
		if (e.target.value.length > 10) return;
		setUsername(e.target.value);
	};
	const onEmailChange = (e) => setEmail(e.target.value);
	const onPasswordChange = (e) => setPassword(e.target.value);
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
			// Fetching Error
			if (res.status === 404) throw new Error("Unable to reach Server, Try again later!");
			const resJSON = await res.json();
			// Check for other error flags
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
		// Validate data
		if (!handleInputValidation()) return false;
		// Send Register Info to server
		setWaitingForServer(true);
		handleRegistering();
	};
	/**
	 * Checks whether input's value are valid
	 * @returns True => All inputs are valid, False => inputs are invalid
	 */
	const handleInputValidation = () => {
		const isEmptyOptions = { ignore_whitespace: true };
		if (validator.isEmpty(username, isEmptyOptions) || validator.isEmpty(email, isEmptyOptions || validator.isEmpty(password, isEmptyOptions))) {
			setErrorMessage("Empty Fields");
			setInputErrors({ username: false, email: false, password: false });
			return false;
		}
		// protected usernames
		if (validator.contains(username, "server") || validator.contains(username, "admin")) {
			setErrorMessage("Unauthorized Username");
			setInputErrors({ ...inputErrors, username: true });
			return false;
		}
		// invalid email
		if (!validator.isEmail(email, { ignore_max_length: false })) {
			setErrorMessage("Invalid Email");
			setInputErrors({ ...inputErrors, username: false, email: true });
			return false;
		}

		return true;
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
						<TextField error={inputErrors.username} onChange={onUsernameChange} value={username} variant="outlined" />
						<Typography color={(theme) => theme.palette.text.secondary} variant="h6">
							Email
						</Typography>
						<TextField error={inputErrors.email} onChange={onEmailChange} value={email} variant="outlined" />
						<Typography color={(theme) => theme.palette.text.secondary} variant="h6">
							Password
						</Typography>
						<TextField error={inputErrors.password} onChange={onPasswordChange} value={password} variant="outlined" />
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
