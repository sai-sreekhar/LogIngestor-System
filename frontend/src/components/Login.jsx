import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { API_V1_BASE_URL } from "./../utils/constants.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LoadingButton from "@mui/lab/LoadingButton";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

const defaultTheme = createTheme();
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login() {
  const [redirectPath, setRedirectPath] = useState("/");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    try {
      setIsLoading(true);
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const username = data.get("username");
      const password = data.get("password");
      const response = await fetch(`${API_V1_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const jsonRes = await response.json();
      if (jsonRes.status === "success") {
        localStorage.setItem("accessToken", jsonRes.data.accessToken);
        localStorage.setItem("role", jsonRes.data.userData.role);
        localStorage.setItem("username", jsonRes.data.userData.username);
        localStorage.setItem("resources", jsonRes.data.userData.resources);
        setIsLoading(false);
        navigate(redirectPath);
      } else {
        setIsLoading(false);
        setSnackbarOpen(true);
        setLoginError(jsonRes.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setSnackbarOpen(true);
      setLoginError(error.message);
    }
  };

  useEffect(() => {
    setRedirectPath(location.state?.path ?? "/");
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate(redirectPath);
    }
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
    setLoginError(null);
  };

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {loginError}
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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
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
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={isLoading}
              >
                Login
              </LoadingButton>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
