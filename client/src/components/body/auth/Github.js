import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { dispatchLogin } from "../../../redux/actions/authAction";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

function Github(props) {
	const dispatch = useDispatch();
	const history = useHistory();
	const search = props.location.search;
	const code = new URLSearchParams(search).get("code");

	const responseGit = async (response) => {
		try {
			if (code) {
				await axios({
					method: "get",
					url: `/user/github_login?code=${code}`,
					timeout: 7000,
				});
				localStorage.setItem("firstLogin", true);
				dispatch(dispatchLogin());
				history.push("/");
			} else {
				history.push("/login");
			}
		} catch (err) {
			history.push("/login");
		}
	};

	useEffect(() => {
		responseGit();
	}, [code]);

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<CircularProgress color="secondary" />
		</div>
	);
}

export default Github;
