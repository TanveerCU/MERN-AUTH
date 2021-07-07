import React from "react";
import Alert from "@material-ui/lab/Alert";

export const showErrMsg = (msg) => {
	return (
		<Alert style={{ marginBottom: "1rem" }} variant="filled" severity="error">
			{msg}
		</Alert>
	);
};

export const showSuccessMsg = (msg) => {
	return (
		<Alert style={{ marginBottom: "1rem" }} variant="filled" severity="success">
			{msg}
		</Alert>
	);
};
