import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import axios from "axios";
import { toast } from 'react-toastify';

export default function DataTable({ columns, rows: initialRows,enableDelete }) {
  const [rows, setRows] = React.useState(initialRows);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const paginationModel = { page: 0, pageSize: 10 };

  const handleDelete = async () => {

    const ids = [...selectionModel];
    
    if (ids.length === 0) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/customer/delete_multiple`,
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
        // console.log("Rows deleted successfully:", response.data);
        toast.success("Selected rows deleted successfully!");
        window.location.reload(); 
      } else {
        console.error("Failed to delete rows:", response.statusText);
        toast.error("Failed to delete selected rows. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      if (error.response && error.response.status === 400) {
        toast.error("Invalid request. Please check your selection.");
      } else {
        toast.error("Failed to delete selected rows. Please try again later.");
      }
    }

    setSelectionModel([]);
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
        {
        enableDelete &&
          <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={selectionModel.length === 0}
        >
          Delete Selected
        </Button>}
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10,50]}
        checkboxSelection={enableDelete}
        
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
