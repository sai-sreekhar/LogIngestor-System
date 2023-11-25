import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Snackbar, Typography } from "@mui/material";
import { API_V1_BASE_URL } from "./../utils/constants.js";
import { json } from "react-router";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DisplaySearchResults({ logQuery, loadingButtonHandler }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 20,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let body = logQuery;
        body.startIndex = pageState.page * pageState.pageSize;

        const response = await fetch(`${API_V1_BASE_URL}/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(body),
        });

        const json = await response.json();
        if (json.status === "success") {
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: json.data.searchResults.hits.hits,
            total: json.data.searchResults.hits.total.value,
          }));
          loadingButtonHandler(false);
        } else {
          loadingButtonHandler(false);
          setSnackbarOpen(true);
          setSnackbarMessage(json.message);
        }
      } catch (err) {
        console.log(err);
        loadingButtonHandler(false);
        setSnackbarOpen(true);
        setSnackbarMessage(json.message);
      }
    };
    fetchData();
  }, [pageState.page, pageState.pageSize, logQuery]);

  const [formattedData, setFormattedData] = useState(
    {
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
          field: "level",
          headerName: "Level",
          width: 175,
          headerAlign: "center",
          align: "center",
        },
        {
          editable: false,
          field: "message",
          headerName: "Message",
          width: 175,
          headerAlign: "center",
          align: "center",
        },
        {
          editable: false,
          field: "resourceId",
          headerName: "Resource ID",
          width: 175,
          headerAlign: "center",
          align: "center",
        },
        {
          editable: false,
          field: "timestamp",
          headerName: "Timestamp",
          width: 175,
          headerAlign: "center",
          align: "center",
        },
        {
          editable: false,
          field: "traceId",
          headerName: "Trace ID",
          width: 175,
          align: "center",
          headerAlign: "center",
        },
        {
          editable: false,
          field: "spanId",
          headerName: "Span ID",
          width: 175,
          align: "center",
          headerAlign: "center",
        },
        {
          editable: false,
          field: "commit",
          headerName: "Commit",
          width: 175,
          align: "center",
          headerAlign: "center",
        },
        {
          editable: false,
          field: "parentResourceId",
          headerName: "Parent Resource ID",
          width: 175,
          align: "center",
          headerAlign: "center",
        },
      ],
      rows: [],
    },
    []
  );

  useEffect(() => {
    const rows = pageState.data.map((row) => {
      return {
        id: row._id,
        level: row._source.level,
        message: row._source.message,
        resourceId: row._source.resourceId,
        timestamp: row._source.timestamp,
        traceId: row._source.traceId,
        spanId: row._source.spanId,
        commit: row._source.commit,
        parentResourceId: row._source.metadata.parentResourceId,
      };
    });
    setFormattedData((prevData) => {
      return { ...prevData, rows: rows };
    });
  }, [pageState.data]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
    setSnackbarMessage(null);
  };

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
      {pageState.data.length === 0 ? (
        <Typography variant="h5" align="center">
          No Logs Found
        </Typography>
      ) : (
        <>
          <Typography variant="h5" align="center">
            Search Results
          </Typography>
          <Typography variant="h6" align="right">
            Total Logs Found: {pageState.total}
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
            paginationMode="server"
            rowCount={pageState.total}
            loading={pageState.isLoading}
            pageSizeOptions={[20]}
            pagination
            pageSize={pageState.pageSize}
            onPaginationModelChange={(newPageState) => {
              setPageState((old) => ({
                ...old,
                page: newPageState.page,
              }));
            }}
            paginationModel={pageState}
            slots={{ toolbar: GridToolbar }}
          />
        </>
      )}
    </div>
  );
}

export default DisplaySearchResults;
