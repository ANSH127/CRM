import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import axios from "axios";

export default function DataTable({ columns, rows: initialRows }) {
  const [rows, setRows] = React.useState(initialRows);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const paginationModel = { page: 0, pageSize: 10 };

  const handleDelete = async () => {
    // console.log("Selected rows for deletion:", selectionModel);

    const ids = [...selectionModel];
    
    if (ids.length === 0) return;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/customer/delete_multiple",
        { ids: ids },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Rows deleted successfully:", response.data);
        alert("Selected rows deleted successfully!");
        window.location.reload(); 
      } else {
        console.error("Failed to delete rows:", response.statusText);
        alert("Failed to delete rows. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      alert("Failed to delete rows. Please try again.");
    }

    setSelectionModel([]);
    console.log("Rows after deletion:", rows);
  };

  React.useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        marginTop: 2,
        margin: "0 auto",
        padding: 2,
      }}
    >
      <div className="flex justify-end mb-2">
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={selectionModel.length === 0}
        >
          Delete Selected
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10,50]}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectionModel(newSelection.ids);
        }}
        selectionModel={selectionModel}
        sx={{ border: 0 }}
        getRowId={(row) => row._id}
      />
    </Paper>
  );
}
