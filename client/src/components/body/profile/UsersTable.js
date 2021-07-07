import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
	showSuccessMsg,
	showErrMsg,
} from "../../utils/notification/Notification";
import {
	fetchAllUsers,
	dispatchGetAllUsers,
} from "../../../redux/actions/usersAction";
import { Box, withStyles } from "@material-ui/core";
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarExport,
	GridToolbarFilterButton,
	GridToolbarColumnsButton,
} from "@material-ui/data-grid";

function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridToolbarExport />
			<GridToolbarFilterButton />
			<GridToolbarColumnsButton />
		</GridToolbarContainer>
	);
}
const StyledDataGrid = withStyles({
	root: {
		"& .MuiDataGrid-renderingZone": {
			overflow: "scroll !important",
		},
		"& .MuiDataGrid-cell": {
			lineHeight: "unset !important",
			maxHeight: "none !important",
			whiteSpace: "normal",
			wordBreak: "break-all",
		},
		"& .MuiDataGrid-row": {
			maxHeight: "none !important",
		},
	},
})(DataGrid);

export default function ColumnSelectorGrid() {
	const initialState = {
		name: "",
		password: "",
		cf_password: "",
		err: "",
		success: "",
	};

	const auth = useSelector((state) => state.auth);
	const token = useSelector((state) => state.token);
	const users = useSelector((state) => state.users);
	const { user, isAdmin } = auth;
	const [data, setData] = useState(initialState);
	const [loading, setLoading] = useState(false);
	const [callback, setCallback] = useState(false);
	const [pageSize, setPageSize] = React.useState(5);
	const dispatch = useDispatch();
	const { err, success } = data;

	useEffect(() => {
		if (isAdmin) {
			fetchAllUsers(token).then((res) => {
				dispatch(dispatchGetAllUsers(res));
			});
		}
	}, [token, isAdmin, dispatch, callback]);

	const handleDelete = async (id) => {
		try {
			if (user._id !== id) {
				if (window.confirm("Are you sure you want to delete this account?")) {
					setLoading(true);
					await axios.delete(`/user/delete/${id}`, {
						headers: { Authorization: token },
					});
					setLoading(false);
					setCallback(!callback);
				}
			}
		} catch (err) {
			setData({ ...data, err: err.response.data.msg, success: "" });
		}
	};

	const columns = [
		{
			field: "name",
			headerName: "Name",
			width: 150,
		},

		{
			field: "email",
			headerName: "Email",
			width: 200,
		},

		{
			field: "role",
			headerName: "Admin",
			width: 150,
			renderCell: (params) => (
				<strong className="px-6">
					{params.value ? (
						<i className="fas fa-check text-green-500" title="Admin"></i>
					) : (
						<i className="fas fa-times text-red-500" title="User"></i>
					)}
				</strong>
			),
		},
		{
			field: "_id",
			headerName: "Action",
			flex: 1,
			renderCell: (params) => (
				<strong className="flex space-x-5 items-center">
					<Link to={`/edit_user/${params.value}`}>
						<i className="fas fa-edit text-gray-600" title="Edit"></i>
					</Link>
					<i
						className="fas fa-trash-alt text-red-600"
						title="Remove"
						onClick={() => handleDelete(params.value)}
					></i>
				</strong>
			),
		},
	];

	const handlePageSizeChange = (params) => {
		setPageSize(params.pageSize);
	};

	return (
		<>
			<div>
				{err && showErrMsg(err)}
				{success && showSuccessMsg(success)}
				{loading && <h3>Loading.....</h3>}
			</div>

			<StyledDataGrid
				autoHeight
				rows={users}
				columns={columns}
				components={{
					Toolbar: CustomToolbar,
				}}
				pageSize={pageSize}
				onPageSizeChange={handlePageSizeChange}
				rowsPerPageOptions={[5, 10, 20]}
				pagination
				getRowId={(row) => row._id}
			/>
		</>
	);
}
