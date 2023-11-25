import {
  Box,
  Container,
  CssBaseline,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import React, { useState } from "react";
import { API_V1_BASE_URL } from "./../utils/constants.js";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import withAuth from "./withAuth.jsx";

const defaultTheme = createTheme();
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AddUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [addUserError, setAddUserError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [inputRole, setInputRole] = useState(0);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const role = localStorage.getItem("role");
  if (role != 0) {
    return (
      <Typography variant="h4" component="h4">
        You are not authorized to access this page.
      </Typography>
    );
  }

  const handleSubmit = async (event) => {
    try {
      setIsLoading(true);
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const username = data.get("username");
      const password = data.get("password");
      let resources = data.get("resources");
      if (inputRole == 0) {
        resources = "all";
      }
      const response = await fetch(`${API_V1_BASE_URL}/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          username,
          password,
          role: inputRole,
          resources,
        }),
      });
      const jsonRes = await response.json();
      if (jsonRes.status === "success") {
        setIsLoading(false);
        setSuccessSnackbarOpen(true);
      } else {
        setIsLoading(false);
        setSnackbarOpen(true);
        setAddUserError(jsonRes.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setSnackbarOpen(true);
      setAddUserError(error.message);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
    setSuccessSnackbarOpen(false);
    setAddUserError(null);
  };

  const handleRoleChange = (event) => {
    setInputRole(event.target.value);
  };

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {addUserError}
        </Alert>
      </Snackbar>

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {"User added successfully!"}
        </Alert>
      </Snackbar>

      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Add User
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                defaultValue="admin"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                defaultValue="admin"
              />
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="role"
                id="role"
                value={inputRole}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value={0}>ADMIN</MenuItem>
                <MenuItem value={1}>SUB ADMIN</MenuItem>
              </Select>
              <TextField
                margin="normal"
                required
                fullWidth
                name="resources"
                label="Resource List"
                id="resources"
                autoComplete="resources"
                placeholder="Enter Comma Separated Resource Ids"
                disabled={inputRole == 1 ? false : true}
              />
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={isLoading}
              >
                Add User
              </LoadingButton>
            </Box>
            <Typography variant="body1" color="grey" align="left">
              <b>Note:</b> Role Based Access is implemented using Admin and
              Sub-Admin roles. Admin has access to all resource logs and
              Sub-Admin will hae access only to the specified Resource Id
              <br />
              <br />
              For Sub-Admin role, Please give the Resource Id for which he can
              access the logs. The Resource Id should match the resource Id in
              the logs
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default withAuth(AddUser);
