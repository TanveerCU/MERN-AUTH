import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
const StyledBadge = withStyles((theme) => ({
	badge: {
		backgroundColor: "#44b700",
		color: "#44b700",
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		"&::after": {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			borderRadius: "50%",
			animation: "$ripple 1.2s infinite ease-in-out",
			border: "1px solid currentColor",
			content: '""',
		},
	},
	"@keyframes ripple": {
		"0%": {
			transform: "scale(.8)",
			opacity: 1,
		},
		"100%": {
			transform: "scale(2.4)",
			opacity: 0,
		},
	},
}))(Badge);
function Header() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const auth = useSelector((state) => state.auth);

	const { user, isLogged } = auth;

	const handleLogout = async () => {
		try {
			await axios.get("/user/logout");
			localStorage.removeItem("firstLogin");
			window.location.href = "/";
		} catch (err) {
			window.location.href = "/";
		}
	};
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const userLink = () => {
		return (
			<div className="flex items-center  space-x-2">
				<StyledBadge
					overlap="circle"
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					variant="dot"
				>
					<Avatar alt="avatar" src={user.avatar} />
				</StyledBadge>

				<span className="flex items-center">
					{user.name}
					<KeyboardArrowDownRoundedIcon
						style={{ cursor: "pointer" }}
						onClick={handleClick}
					/>
				</span>
				<Menu
					id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<Link to="/profile">
						{" "}
						<MenuItem onClick={handleClose}>Profile</MenuItem>
					</Link>

					<Link to="/" onClick={handleLogout}>
						{" "}
						<MenuItem>Logout</MenuItem>
					</Link>
				</Menu>
			</div>
		);
	};

	return (
		<header className="flex items-center justify-between py-5 px-5 shadow-xl mb-5">
			<Link to="/">
				<span className="text-xl font-bold"> Auth Task</span>
			</Link>
			{isLogged ? (
				userLink()
			) : (
				<Link to="/login" className="flex items-center space-x-2">
					<ExitToAppRoundedIcon />
					<p className="font-bold"> Sign in</p>
				</Link>
			)}
		</header>
	);
}

export default Header;
