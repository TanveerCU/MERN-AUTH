import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { isLength, isMatch } from "../../utils/validation/Validation";
import {
	showSuccessMsg,
	showErrMsg,
} from "../../utils/notification/Notification";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CameraAltRoundedIcon from "@material-ui/icons/CameraAltRounded";

import UsersTable from "./UsersTable";

const initialState = {
	name: "",
	password: "",
	cf_password: "",
	err: "",
	success: "",
};

function Profile() {
	const auth = useSelector((state) => state.auth);
	const token = useSelector((state) => state.token);

	const { user, isAdmin } = auth;
	const [data, setData] = useState(initialState);
	const { name, password, cf_password, err, success } = data;

	const [avatar, setAvatar] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value, err: "", success: "" });
	};

	const changeAvatar = async (e) => {
		e.preventDefault();
		try {
			const file = e.target.files[0];

			if (!file)
				return setData({
					...data,
					err: "No files were uploaded.",
					success: "",
				});

			if (file.size > 1024 * 1024)
				return setData({ ...data, err: "Size too large.", success: "" });

			if (file.type !== "image/jpeg" && file.type !== "image/png")
				return setData({
					...data,
					err: "File format is incorrect.",
					success: "",
				});

			let formData = new FormData();
			console.log("form Data before append: ", formData);
			formData.append("file", file);
			console.log("form Data after append", formData);

			setLoading(true);
			const res = await axios.post("/api/upload_avatar", formData, {
				headers: {
					"content-type": "multipart/form-data",
					Authorization: token,
				},
			});

			setLoading(false);
			setAvatar(res.data.url);
			console.log(res.data.url);
		} catch (err) {
			setData({ ...data, err: err.response.data.msg, success: "" });
		}
	};

	const updateInfor = () => {
		try {
			axios.patch(
				"/user/update",
				{
					name: name ? name : user.name,
					avatar: avatar ? avatar : user.avatar,
				},
				{
					headers: { Authorization: token },
				}
			);

			setData({ ...data, err: "", success: "Updated Success!" });
		} catch (err) {
			setData({ ...data, err: err.response.data.msg, success: "" });
		}
	};

	const updatePassword = () => {
		if (isLength(password))
			return setData({
				...data,
				err: "Password must be at least 6 characters.",
				success: "",
			});

		if (!isMatch(password, cf_password))
			return setData({ ...data, err: "Password did not match.", success: "" });

		try {
			axios.post(
				"/user/reset",
				{ password },
				{
					headers: { Authorization: token },
				}
			);

			setData({ ...data, err: "", success: "Updated Success!" });
		} catch (err) {
			setData({ ...data, err: err.response.data.msg, success: "" });
		}
	};

	const handleUpdate = () => {
		if (name || avatar) updateInfor();
		if (password) updatePassword();
	};

	return (
		<>
			<div>
				{err && showErrMsg(err)}
				{success && showSuccessMsg(success)}
				{loading && <h3>Loading.....</h3>}
			</div>
			<div className="flex flex-wrap justify-center align-center space-x-3 mb-10 p-5">
				<div className="flex flex-col space-y-3 mb-10 p-4 shadow-2xl rounded-xl">
					<div className="flex flex-col items-center">
						<h2 className="text-xl font-bold">
							{isAdmin ? "Admin Profile" : "User Profile"}
						</h2>
						<input
							type="file"
							name="file"
							id="file_up"
							onChange={changeAvatar}
							style={{ display: "none" }}
						/>
						<Badge
							overlap="circle"
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right",
							}}
							style={{ height: "10rem", width: "10rem" }}
							badgeContent={
								<label htmlFor="file_up">
									<IconButton
										color="primary"
										aria-label="upload picture"
										component="span"
									>
										<CameraAltRoundedIcon
											style={{
												height: "3rem",
												width: "3rem",
												color: "#3498DB ",
											}}
										/>
									</IconButton>
								</label>
							}
						>
							<Avatar
								alt="avatar"
								src={avatar ? avatar : user.avatar}
								style={{ height: "10rem", width: "10rem" }}
							/>
						</Badge>
					</div>
					<div className="flex flex-col space-y-3">
						<div className="flex items-center  space-x-3">
							<label htmlFor="name">Name</label>
							<input
								type="text"
								name="name"
								id="name"
								defaultValue={user.name}
								placeholder="Your name"
								onChange={handleChange}
								className="bg-green-100 rounded p-2 flex-1"
							/>
						</div>
						<div className="flex items-center  space-x-4">
							<label htmlFor="email">Email</label>
							<input
								type="email"
								name="email"
								id="email"
								defaultValue={user.email}
								placeholder="Your email address"
								disabled
								className="bg-green-100 rounded p-2 flex-1"
							/>
						</div>

						<div className="flex items-center  space-x-4">
							<label htmlFor="password">New Password</label>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="Your password"
								value={password}
								onChange={handleChange}
								className="bg-green-100 rounded p-2 flex-1"
							/>
						</div>

						<div className="flex items-center  space-x-4">
							<label htmlFor="cf_password">Confirm New Password</label>
							<input
								type="password"
								name="cf_password"
								id="cf_password"
								placeholder="Confirm password"
								value={cf_password}
								onChange={handleChange}
								className="bg-green-100 rounded p-2 flex-1"
							/>
						</div>

						<div className="flex flex-wrap w-80">
							<em style={{ color: "crimson" }}>
								* If you update your password here, you will not be able to
								login quickly using google and facebook.
							</em>
						</div>

						<button
							className="px-4 py-2 rounded bg-blue-900 text-white font-extrabold"
							disabled={loading}
							onClick={handleUpdate}
						>
							Update
						</button>
					</div>
				</div>

				<div className="flex-1 h-80">
					<h2 className="text-xl font-bold">
						{isAdmin ? "Users" : "My Orders"}
					</h2>
					<UsersTable />
				</div>
			</div>
		</>
	);
}

export default Profile;
