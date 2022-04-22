import React, { useState } from "react";
import { Container, TextField, Typography } from "@mui/material";
import { PageBackgroundPaper, ContentBox, ContentPaper, PageTitle, ButtonPaper, SubmitButton, AlternativeOptionTraverseLink } from "./AuthStyles";
import { Link } from "react-router-dom";
import AppearanceToggleBar from "./AppearanceToggleBar";

// [TODO]:
// Have loading animation for Heroku Startup timing, gonna take awhile
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
			if (res.status === 404) throw new Error("Unable to login");
			const resJSON = await res.json();
			if (resJSON.errorCode) throw new Error("Unable to login");
			const { username, _dbId, token } = resJSON;
			LoginUser(username, _dbId, token);
		} catch (error) {
			// [TODO]:
			// Display errors to user instead of console logging
			console.log(error);
		}
	};
	const onSubmitButtonPressed = () => {
		if (!email || !password) return false;
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
						<Typography variant="h6">Email</Typography>
						<TextField onChange={onEmailChange} value={email} variant="outlined" />
						<Typography sx={{ marginTop: "10px" }} variant="h6">
							Password
						</Typography>
						<TextField onChange={onPasswordChange} value={password} variant="outlined" />
						<form onSubmit={onSubmitButtonPressed}>
							<ButtonPaper>
								<SubmitButton variant="contained" onClick={onSubmitButtonPressed}>
									<Typography variant="p">Login</Typography>
								</SubmitButton>
							</ButtonPaper>
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
