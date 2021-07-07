import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
	showErrMsg,
	showSuccessMsg,
} from "../../utils/notification/Notification";
import {
	isEmpty,
	isEmail,
	isLength,
	isMatch,
} from "../../utils/validation/Validation";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
	paper: {
		// marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		boxShadow: "9px 11px 29px -5px rgba(0,0,0,0.63)",
		padding: "2rem",
		borderRadius: "1rem",
		marginBottom: theme.spacing(2),
	},
	avatar: {
		// margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(2),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));
const initialState = {
	name: "",
	email: "",
	password: "",
	cf_password: "",
	err: "",
	success: "",
};

export default function Register() {
	const classes = useStyles();
	const [user, setUser] = useState(initialState);

	const { name, email, password, cf_password, err, success } = user;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value, err: "", success: "" });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isEmpty(name) || isEmpty(password))
			return setUser({
				...user,
				err: "Please fill in all fields.",
				success: "",
			});

		if (!isEmail(email))
			return setUser({ ...user, err: "Invalid emails.", success: "" });

		if (isLength(password))
			return setUser({
				...user,
				err: "Password must be at least 6 characters.",
				success: "",
			});

		if (!isMatch(password, cf_password))
			return setUser({ ...user, err: "Password did not match.", success: "" });

		try {
			const res = await axios.post("/user/register", {
				name,
				email,
				password,
			});

			setUser({ ...user, err: "", success: res.data.msg });
		} catch (err) {
			err.response.data.msg &&
				setUser({ ...user, err: err.response.data.msg, success: "" });
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<form className={classes.form} noValidate>
					{err && showErrMsg(err)}
					{success && showSuccessMsg(success)}
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								label="Enter your name"
								id="name"
								value={name}
								name="name"
								onChange={handleChangeInput}
								autoFocus
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								value={email}
								name="email"
								onChange={handleChangeInput}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password"
								label="Enter password"
								type="password"
								id="password"
								value={password}
								onChange={handleChangeInput}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								label="Confirm password"
								type="password"
								id="cf_password"
								value={cf_password}
								name="cf_password"
								onChange={handleChangeInput}
							/>
						</Grid>
					</Grid>
					<Button
						onClick={handleSubmit}
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Sign Up
					</Button>
					<Grid container justify="flex-end">
						<Grid item>
							<Link to="/login">
								<span className="font-bold hover:underline hover:text-blue-900 ">
									Already an account? Login
								</span>
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
}
