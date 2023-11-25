import React, { useEffect, useState } from "react";
import { formatQuery, QueryBuilder } from "react-querybuilder";
import { fields } from "./../utils/fields.js";
import "react-querybuilder/dist/query-builder.css";
import "./../styles/styles.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryBuilderMaterial } from "@react-querybuilder/material";
import { Box, Button, Grid, Snackbar, Typography } from "@mui/material";
import DisplaySearchResults from "./DisplaySearchResults.jsx";
import LoadingButton from "@mui/lab/LoadingButton";
import MuiAlert from "@mui/material/Alert";
import { validateQuery } from "../utils/validateQuery.js";
import withAuth from "./withAuth.jsx";
import { useNavigate } from "react-router";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const muiTheme = createTheme();

const initialQuery = {
  combinator: "and",
  rules: [
    {
      field: "level",
      operator: "=",
      value: "error",
    },
    {
      field: "message",
      operator: "contains",
      value: "Failed",
    },
  ],
};

function Dashboard() {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [logQuery, setLogQuery] = useState(null);
  const [shouldDisplayResults, setShouldDisplayResults] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [filteredFields, setFilteredFields] = useState(fields);

  const handleButtonClick = async () => {
    try {
      setIsLoading(true);
      let body = formatQuery(query, "json_without_ids");
      let bodyJson = JSON.parse(body);

      //for every timestamp rule add :00Z at end
      bodyJson.rules.forEach((rule) => {
        if (rule.field === "timestamp") {
          rule.value += ":00Z";
        }
      });

      const isInvalid = await validateQuery(bodyJson, (validationError) =>
        setValidationError(validationError)
      );

      if (isInvalid) {
        setIsLoading(false);
        setSnackbarOpen(true);
        return;
      }

      setLogQuery(bodyJson);
      setShouldDisplayResults(true);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
    setValidationError(null);
  };

  const loadingButtonHandler = (isLoading) => {
    setIsLoading(isLoading);
  };

  const removeResourceIDForSubAdminFromFields = () => {
    let newFields = fields.filter((field) => field.name !== "resourceId");
    return newFields;
  };

  useEffect(() => {
    if (role == 1) {
      let filteredFields = removeResourceIDForSubAdminFromFields();
      setFilteredFields(filteredFields);
    }
  }, []);

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {validationError}
        </Alert>
      </Snackbar>

      <ThemeProvider theme={muiTheme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "100%",
            mt: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={12}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  mb: 2,
                  ml: 2,
                  mr: 2,
                  float: "right",
                }}
                size="large"
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("resources");
                  localStorage.removeItem("role");
                  localStorage.removeItem("username");
                  navigate("/login");
                }}
              >
                Logout
              </Button>

              {role == 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 2,
                    mb: 2,
                    ml: 2,
                    mr: 2,
                    float: "right",
                  }}
                  size="large"
                  onClick={() => {
                    navigate("/addUser");
                  }}
                >
                  Add Users
                </Button>
              )}
              {role == 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 2,
                    mb: 2,
                    ml: 2,
                    mr: 2,
                    float: "right",
                  }}
                  size="large"
                  onClick={() => {
                    navigate("/listUsers");
                  }}
                >
                  List Users
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                }}
                align="center"
              >
                Log Query Tool
              </Typography>
            </Grid>
          </Grid>
          <QueryBuilderMaterial>
            <QueryBuilder
              fields={filteredFields}
              query={query}
              onQueryChange={setQuery}
              listsAsArrays
              resetOnFieldChange={false}
            />
          </QueryBuilderMaterial>
          <LoadingButton
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              mb: 2,
            }}
            loading={isLoading}
            size="large"
            onClick={handleButtonClick}
          >
            Query Logs
          </LoadingButton>

          {shouldDisplayResults && (
            <DisplaySearchResults
              logQuery={logQuery}
              loadingButtonHandler={loadingButtonHandler}
            />
          )}
        </Box>
      </ThemeProvider>
    </>
  );
}

export default withAuth(Dashboard);
