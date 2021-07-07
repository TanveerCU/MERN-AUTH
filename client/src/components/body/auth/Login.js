//////////////////////////// Dependencies
import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
	showErrMsg,
	showSuccessMsg,
} from "../../utils/notification/Notification";
import { dispatchLogin } from "../../../redux/actions/authAction";
import { useDispatch } from "react-redux";
////////////////////////// styling elements
const useStyles = makeStyles((theme) => ({
	paper: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		boxShadow: "9px 11px 29px -5px rgba(0,0,0,0.63)",
		padding: "2rem",
		borderRadius: "1rem",
		marginBottom: theme.spacing(2),
	},
	avatar: {
		backgroundColor: theme.palette.warning.dark,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	margin: {
		margin: theme.spacing(1),
	},
	withoutLabel: {
		marginTop: theme.spacing(3),
	},
	textField: {
		width: "25ch",
	},
	bgColor: {
		backgroundColor: theme.palette.grey[800],
		color: "white",
		"&:hover": {
			backgroundColor: theme.palette.grey[700],
		},
	},
}));

/////////////////////////// initial variable
const initialState = {
	email: "",
	password: "",
	err: "",
	success: "",
	showPassword: false,
	weightRange: "",
};

////////////////////////////////// Main Sing-In component
function Login() {
	/////////////////////////// variables
	const classes = useStyles();

	const [user, setUser] = useState(initialState);
	const dispatch = useDispatch();
	const history = useHistory();
	const { email, password, err, success } = user;
	/////////////////////////// Fuctions
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("/user/login", { email, password });
			setUser({ ...user, err: "", success: res.data.msg });

			localStorage.setItem("firstLogin", true);

			dispatch(dispatchLogin());
			history.push("/");
		} catch (err) {
			err.response.data.msg &&
				setUser({ ...user, err: err.response.data.msg, success: "" });
		}
	};
	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value, err: "", success: "" });
	};
	const responseGoogle = async (response) => {
		try {
			console.log("I am Hit");
			const res = await axios.post("/user/google_login", {
				tokenId: response.tokenId,
			});

			setUser({ ...user, error: "", success: res.data.msg });
			localStorage.setItem("firstLogin", true);

			dispatch(dispatchLogin());
			history.push("/");
		} catch (err) {
			err.response.data.msg &&
				setUser({ ...user, err: err.response.data.msg, success: "" });
		}
	};

	const responseFacebook = async (response) => {
		try {
			const { accessToken, userID } = response;
			const res = await axios.post("/user/facebook_login", {
				accessToken,
				userID,
			});

			setUser({ ...user, error: "", success: res.data.msg });
			localStorage.setItem("firstLogin", true);

			dispatch(dispatchLogin());
			history.push("/");
		} catch (err) {
			err.response.data.msg &&
				setUser({ ...user, err: err.response.data.msg, success: "" });
		}
	};

	const handleClickShowPassword = () => {
		setUser({
			...user,
			showPassword: !user.showPassword,
			err: "",
			success: "",
		});
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	/////////////////////////// JSX
	return (
		<>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>

					<form className={classes.form} noValidate>
						{err && showErrMsg(err)}
						{success && showSuccessMsg(success)}
						<div className="flex flex-col space-y-3 shadow-lg">
							<GoogleLogin
								clientId="352417046071-1bu5j0u2b2s9ehm8ghedmopjq51s6cnf.apps.googleusercontent.com"
								onSuccess={responseGoogle}
								cookiePolicy={"single_host_origin"}
								className="bg-blue-900"
								render={(renderProps) => {
									return (
										<Button
											onClick={renderProps.onClick}
											variant="contained"
											color="secondary"
											startIcon={<i class="fab fa-google-plus-g"></i>}
										>
											Sign In with Google
										</Button>
									);
								}}
								disabled={false}
							/>

							<FacebookLogin
								fullWidth
								appId="851095925836572"
								autoLoad={false}
								fields="name,email,picture"
								callback={responseFacebook}
								render={(renderProps) => {
									return (
										<Button
											onClick={renderProps.onClick}
											variant="contained"
											color="primary"
											startIcon={<i class="fab fa-facebook-f"></i>}
										>
											Sign In with Facebook
										</Button>
									);
								}}
							/>
							<Button
								variant="contained"
								className={classes.bgColor}
								href={`https://github.com/login/oauth/authorize?client_id=da31c476f11235adf15d&
								scope=user:email`}
							>
								<i class="fab fa-github text-lg z-10 px-3"></i>
								Sign In with Github
							</Button>
						</div>

						<div className="mt-5 flex flex-col">
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								onChange={handleChangeInput}
								autoFocus
							/>

							<FormControl variant="outlined" fullWidth required>
								<InputLabel htmlFor="outlined-adornment-password">
									Password
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-password"
									name="password"
									type={user.showPassword ? "text" : "password"}
									value={password}
									onChange={handleChangeInput}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end"
											>
												{user.showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									}
									labelWidth={80}
								/>
							</FormControl>
							<Link to="/forgot_password" className="mt-1">
								<span className="font-bold hover:underline hover:text-blue-900 mt-2">
									Forgot password ?
								</span>
							</Link>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={handleSubmit}
							>
								Sign In
							</Button>
							<Grid container>
								<Grid item>
									<Link to="/register">
										<span className="font-bold hover:underline hover:text-blue-900 ">
											Don't have an account ? Sign Up
										</span>
									</Link>
								</Grid>
							</Grid>
						</div>
					</form>
				</div>
			</Container>
		</>
	);
}

export default Login;
