import React, { useRef } from "react";
import GitHubLogin from "react-github-login";
import Button from "@material-ui/core/Button";

export default function LogIn() {
	const onSuccess = (response) => console.log(response);
	const onFailure = (response) => console.error(response);
	return (
		<div className="App">
			<Button variant="contained" color="secondary">
				<GitHubLogin
					clientId="ac56fad434a3a3c1561e"
					onSuccess={onSuccess}
					onFailure={onFailure}
				/>
			</Button>
		</div>
	);
}
