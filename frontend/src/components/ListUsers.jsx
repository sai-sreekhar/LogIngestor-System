import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Snackbar, Typography } from "@mui/material";
import { API_V1_BASE_URL } from "../utils/constants.js";
import MuiAlert from "@mui/material/Alert";
import withAuth from "./withAuth.jsx";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ListUsers() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const role = localStorage.getItem("role");

  const [formattedData, setFormattedData] = useState({
    columns: [
      {
        field: "id",
        hide: true,
        headerAlign: "center",
        align: "center",
        editable: false,
      },
      {
        editable: false,
        field: "username",
        headerName: "Username",
        width: 300,
        headerAlign: "center",
        align: "center",
      },
      {
        editable: false,
        field: "role",
        headerName: "Role",
        width: 300,
        headerAlign: "center",
        align: "center",
      },
      {
        editable: false,
        field: "resourceId",
        headerName: "Has Access To Resource",
        width: 300,
        headerAlign: "center",
        align: "center",
      },
    ],
    rows: [],
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_V1_BASE_URL}/listUsers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const json = await response.json();
        if (json.status === "success") {
          const formattedRows = json.data.users.map((user) => {
            return {
              id: user._id,
              username: user.username,
              role: user.role == 0 ? "Admin" : "Sub Admin",
              resourceId: user.resources,
            };
          });
          setFormattedData((old) => ({
            ...old,
            rows: formattedRows,
          }));
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setSnackbarOpen(true);
          setSnackbarMessage(json.message);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setSnackbarOpen(true);
        setSnackbarMessage("Something went wrong");
      }
    };
    fetchData();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
    setSnackbarMessage(null);
  };

  if (role != 0) {
    return (
      <Typography variant="h4" component="h4">
        You are not authorized to access this page.
      </Typography>
    );
  }

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Typography variant="h5" align="center">
        User List
      </Typography>
      <DataGrid
        sx={{
          mt: 2,
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
          backgroundColor: "#ADD8E6",
        }}
        {...formattedData}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        loading={isLoading}
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
}

export default withAuth(ListUsers);
