import React, { useState } from "react";
import axios from "axios";
import {
	showErrMsg,
	showSuccessMsg,
} from "../../utils/notification/Notification";
import { isLength, isMatch } from "../../utils/validation/Validation";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		boxShadow: "9px 11px 29px -5px rgba(0,0,0,0.63)",
		padding: "2rem",
		borderRadius: "1rem",
	},

	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const initialState = {
	password: "",
	cf_password: "",
	err: "",
	success: "",
};

export default function ResetPassword() {
	const classes = useStyles();
	const [data, setData] = useState(initialState);
	const { token } = useParams();

	const { password, cf_password, err, success } = data;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value, err: "", success: "" });
	};

	const handleResetPass = async () => {
		if (isLength(password))
			return setData({
				...data,
				err: "Password must be at least 6 characters.",
				success: "",
			});

		if (!isMatch(password, cf_password))
			return setData({ ...data, err: "Password did not match.", success: "" });

		try {
			const res = await axios.post(
				"/user/reset",
				{ password },
				{
					headers: { Authorization: token },
				}
			);

			return setData({ ...data, err: "", success: res.data.msg });
		} catch (err) {
			err.response.data.msg &&
				setData({ ...data, err: err.response.data.msg, success: "" });
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Reset Your Password ?
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
								label="password"
								type="password"
								name="password"
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
								label="confirm password"
								type="password"
								name="cf_password"
								id="cf_password"
								value={cf_password}
								onChange={handleChangeInput}
							/>
						</Grid>
					</Grid>
					<Button
						onClick={handleResetPass}
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Reset Password
					</Button>
				</form>
			</div>
		</Container>
	);
}
